import mongoose, { Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: string;
  availableFrom: Date;
  listedBy: string;
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: string;
  createdBy: mongoose.Types.ObjectId;
}

const propertySchema = new mongoose.Schema<IProperty>({
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  areaSqFt: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: { type: [String], required: true },
  furnished: { type: String, required: true },
  availableFrom: { type: Date, required: true },
  listedBy: { type: String, required: true },
  tags: { type: [String], required: true },
  colorTheme: { type: String, required: true },
  rating: { type: Number, required: true },
  isVerified: { type: Boolean, required: true },
  listingType: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Property = mongoose.model<IProperty>('Property', propertySchema);
export default Property;