import express,{ Request, Response } from 'express';
import {
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  searchProperties
} from '../services/property.service';

export const createPropertyHandler = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return
    }

    const property = await createProperty({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(property);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getPropertyHandler = async (req: Request, res: Response) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return
    }
    res.json(property);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updatePropertyHandler = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return
    }

    const property = await updateProperty(
      req.params.id,
      req.body,
      req.user._id.toString()
    );
    res.json(property);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const deletePropertyHandler = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return
    }

    await deleteProperty(req.params.id, req.user._id.toString());
    res.json({ message: 'Property removed' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const searchPropertiesHandler = async (req: Request, res: Response) => {
  try {
    const result = await searchProperties(req.query);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};