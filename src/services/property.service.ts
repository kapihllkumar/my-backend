import Property from '../models/Property';
import { redisClient } from '../config/redis';

const cacheExpiration = 3600; 

export const createProperty = async (propertyData: any) => {
  const property = await Property.create(propertyData);
  return property;
};

export const getPropertyById = async (id: string) => {
  const cacheKey = `property:${id}`;
  

  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  

  const property = await Property.findById(id).populate('createdBy', 'name email');
  if (property) {
    await redisClient.setEx(cacheKey, cacheExpiration, JSON.stringify(property));
  }
  
  return property;
};

export const updateProperty = async (id: string, updateData: any, userId: string) => {
  const property = await Property.findOne({ _id: id, createdBy: userId });
  if (!property) {
    throw new Error('Property not found or not authorized');
  }
  
  Object.assign(property, updateData);
  await property.save();
  

  const cacheKey = `property:${id}`;
  await redisClient.setEx(cacheKey, cacheExpiration, JSON.stringify(property));
  
  return property;
};

export const deleteProperty = async (id: string, userId: string) => {
  const property = await Property.findOneAndDelete({ _id: id, createdBy: userId });
  if (!property) {
    throw new Error('Property not found or not authorized');
  }
  

  await redisClient.del(`property:${id}`);
  return property;
};

export const searchProperties = async (filters: any) => {
  const {
    type, minPrice, maxPrice, state, city, minArea, maxArea, bedrooms, bathrooms,
    furnished, amenities, tags, listingType, sortBy, limit = 10, page = 1
  } = filters;
  
  const query: any = {};
  
  if (type) query.type = type;
  if (state) query.state = state;
  if (city) query.city = city;
  if (furnished) query.furnished = furnished;
  if (listingType) query.listingType = listingType;
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  
  if (minArea || maxArea) {
    query.areaSqFt = {};
    if (minArea) query.areaSqFt.$gte = Number(minArea);
    if (maxArea) query.areaSqFt.$lte = Number(maxArea);
  }
  
  if (bedrooms) query.bedrooms = Number(bedrooms);
  if (bathrooms) query.bathrooms = Number(bathrooms);
  
  if (amenities) {
    query.amenities = { $all: amenities.split(',') };
  }
  
  if (tags) {
    query.tags = { $all: tags.split(',') };
  }
  
  const skip = (Number(page) - 1) * Number(limit);
  
  let sortOption = {};
  if (sortBy) {
    const sortFields = sortBy.split(',');
    sortOption = sortFields.reduce((acc: Record<string, 1 | -1>, field: string) => {
      const order = field.startsWith('-') ? -1 : 1;
      const fieldName = field.replace(/^-/, '');
      acc[fieldName] = order;
      return acc;
    },{} as Record<string, 1 | -1>);
  }
  
  const properties = await Property.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .populate('createdBy', 'name email');
  
  const total = await Property.countDocuments(query);
  
  return {
    properties,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total
  };
};