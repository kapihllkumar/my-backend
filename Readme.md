# Property Listing API - README

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Importing Sample Data](#importing-sample-data)
- [API Endpoints](#api-endpoints)
- [Features Implemented](#features-implemented)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

---

## Overview

This property management system offers a robust set of functionalities designed to deliver efficient data handling, secure user interactions, and an enhanced user experience.

### CSV Data Import
- Bulk import property data from CSV files directly into MongoDB for seamless database population.

### Property Management with Ownership Controls
- Full CRUD (Create, Read, Update, Delete) operations for property listings.
- Update and deletion privileges are restricted to the original creator of the property (tracked via the `createdBy` field), ensuring data integrity and user accountability.

### Advanced Search and Filtering
- Powerful search functionality supporting filtering on more than 10 property attributes, such as price range, location, amenities, furnishing status, and more.
- Enables users to efficiently find properties that match their precise criteria.

### Performance Optimization with Redis Caching
- Integration of Redis caching to accelerate frequent read and write operations.
- Reduces database load and improves response times for commonly accessed data.

### User Authentication and Profile Management
- Secure user registration and login with email and password credentials.
- Enables personalized user experiences and protected endpoints.

### Favorites Management
- Users can add or remove properties from their favorites.
- Full CRUD operations on the favorites list for easy management of saved properties.

### Property Recommendation System
- Users can recommend properties to other registered users by searching recipients via email.
- Recommended properties are saved in the recipient’s “Recommendations Received” section.
- Facilitates seamless sharing and enhances user engagement within the platform.

---

## Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)  
- npm (comes bundled with Node.js)  
- MongoDB (running locally or accessible via connection string)  
- Redis (running locally or accessible via connection string)  

---

## Installation

Install dependencies:

```bash
npm install
```

##Create a .env file in the root directory with the following:

MONGO_URI=mongodb://localhost:27017/property-listing
REDIS_URI=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development


# Configuration

Ensure the following services are running:

- MongoDB server  
- Redis server


# Running the Application

Start the development server:

```bash
npm run dev
```


# Importing Sample Data

To import sample property data from a CSV file:

- Place your CSV file named `data.csv` in the root directory

- Run the import script:

```bash
npm run importdata
```


# API Endpoints

## User Routes

- `POST /api/users/register` – Register a new user  
- `POST /api/users/login` – Authenticate user  
- `GET /api/users/profile` – Get user profile (protected)  
- `PUT /api/users/profile` – Update user profile (protected)  
- `POST /api/users/favorites/:propertyId` – Add property to favorites (protected)  
- `DELETE /api/users/favorites/:propertyId` – Remove property from favorites (protected)  
- `POST /api/users/recommend` – Recommend a property to another user (protected)  
- `GET /api/users/recommendations` – Get recommended properties (protected)  

## Property Routes

- `POST /api/properties` – Create a new property (protected)  
- `GET /api/properties` – Search/filter properties  
- `GET /api/properties/:id` – Get property by ID  
- `PUT /api/properties/:id` – Update property (protected - owner only)  
- `DELETE /api/properties/:id` – Delete property (protected - owner only)  


# Features Implemented

- **CSV Data Import:**  
  Import property data from CSV files with automatic association to an admin user.

- **Property CRUD:**  
  Full Create, Read, Update, and Delete operations with strict owner-based authorization to ensure only property creators can modify or delete their listings.

- **Advanced Search:**  
  Powerful filtering across more than 10 property attributes, supporting sorting and pagination for efficient property discovery.

- **Redis Caching:**  
  Implements caching for frequently accessed properties and user data to improve performance and reduce database load.

- **User Authentication:**  
  JWT-based secure user registration and login system.

- **Favorites Management:**  
  Users can add or remove properties from their favorites list with full CRUD support.

- **Recommendation System:**  
  Allows users to recommend properties to other registered users, with recommendations stored and viewable by recipients.

---

# Scripts

- `npm run dev` — Start the development server  
- `npm run import` — Import property data from CSV  
- `npm start` — Start the production server  
- `npm test` — Run tests (to be implemented)  

---

# Troubleshooting

- **Connection Issues:**  
  Ensure MongoDB and Redis servers are running.

- **Authentication Errors:**  
  Verify that the JWT token is correctly included in the Authorization header.

- **CSV Import Errors:**  
  Check that the CSV file format matches the expected structure.



