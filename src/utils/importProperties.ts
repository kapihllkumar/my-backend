import csv from 'csv-parser';
import fs from 'fs';
import Property from '../models/Property';
import User from '../models/User';

interface CsvProperty {
  id: string;
  title: string;
  type: string;
  price: string;
  state: string;
  city: string;
  areaSqFt: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string;
  furnished: string;
  availableFrom: string;
  listedBy: string;
  tags: string;
  colorTheme: string;
  rating: string;
  isVerified: string;
  listingType: string;
}

export const importPropertiesFromCSV = async (filePath: string, adminUserId: string) => {
  const properties: any[] = [];
  
  // First, find or create an admin user to associate with imported properties
  let adminUser = await User.findById(adminUserId);
  if (!adminUser) {
    throw new Error('Admin user not found');
  }
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: CsvProperty) => {
        // Transform CSV data to match our schema
        const property = {
          title: data.title,
          type: data.type,
          price: Number(data.price),
          state: data.state,
          city: data.city,
          areaSqFt: Number(data.areaSqFt),
          bedrooms: Number(data.bedrooms),
          bathrooms: Number(data.bathrooms),
          amenities: data.amenities.split('|'),
          furnished: data.furnished,
          availableFrom: new Date(data.availableFrom),
          listedBy: data.listedBy,
          tags: data.tags.split('|'),
          colorTheme: data.colorTheme,
          rating: Number(data.rating),
          isVerified: data.isVerified === 'TRUE',
          listingType: data.listingType,
          createdBy: adminUser!._id
        };
        properties.push(property);
      })
      .on('end', async () => {
        try {
          await Property.insertMany(properties);
          console.log(`Successfully imported ${properties.length} properties`);
          resolve(properties.length);
        } catch (error) {
          console.error('Error importing properties:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
};