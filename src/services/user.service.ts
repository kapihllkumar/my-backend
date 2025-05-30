import User from '../models/User';
import Property from '../models/Property';
import { redisClient } from '../config/redis';
import mongoose from 'mongoose';

const cacheExpiration = 3600; // 1 hour

// Helper function to safely create ObjectId from string
const toObjectId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
};

export const registerUser = async (name: string, email: string, password: string) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }
  
  const user = await User.create({ name, email, password });
  return user;
};

export const authUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return user;
  } else {
    throw new Error('Invalid email or password');
  }
};

export const getUserProfile = async (userId: string) => {
  const cacheKey = `user:${userId}`;
  
  // Try to get data from cache
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  
  // If not in cache, get from DB and cache it
  const user = await User.findById(userId).select('-password');
  if (user) {
    await redisClient.setEx(cacheKey, cacheExpiration, JSON.stringify(user));
  }
  
  return user;
};

export const updateUserProfile = async (userId: string, updateData: any) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  Object.assign(user, updateData);
  await user.save();
  
  // Update cache
  await redisClient.del(`user:${userId}`);
  
  return user;
};

export const addFavorite = async (userId: string, propertyId: string) => {
  const user = await User.findById(userId);
  const property = await Property.findById(propertyId);
  
  if (!user || !property) {
    throw new Error('User or property not found');
  }
  
  if (!user.favorites.includes(property._id as mongoose.Types.ObjectId)) {
    user.favorites.push(property._id as mongoose.Types.ObjectId);
    await user.save();
  }
  

  await redisClient.del(`user:${userId}`);
  
  return user;
};

export const removeFavorite = async (userId: string, propertyId: string) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  user.favorites = user.favorites.filter(
    fav => fav.toString() !== propertyId
  );
  
  await user.save();
  
  await redisClient.del(`user:${userId}`);
  
  return user;
};

export const recommendProperty = async (
  senderId: string,
  recipientEmail: string,
  propertyId: string
) => {
  const recipient = await User.findOne({ email: recipientEmail });
  const property = await Property.findById(propertyId);

  if (!recipient || !property) {
    throw new Error('Recipient or property not found');
  }

  const existingRecommendation = recipient.recommendationsReceived.find(
    rec =>
      rec.property.toString() === propertyId &&
      rec.recommendedBy.toString() === senderId
  );

  if (existingRecommendation) {
    throw new Error('Property already recommended to this user');
  }

  recipient.recommendationsReceived.push({
    property: property._id as mongoose.Types.ObjectId,
    recommendedBy: toObjectId(senderId),
    date: new Date(),
  });

  await recipient.save();

  await redisClient.del(`user:${recipient._id}`);

  return recipient;
};

export const getRecommendations = async (userId: string) => {
  const user = await User.findById(userId)
    .populate({
      path: 'recommendationsReceived',
      populate: [
        { path: 'property', model: 'Property' },
        { path: 'recommendedBy', model: 'User', select: 'name email' },
      ],
    });

  if (!user) {
    throw new Error('User not found');
  }

  return user.recommendationsReceived;
};
