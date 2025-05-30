// app.ts (updated)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middlewares/errorHandler';
import propertyRoutes from './routes/propertyRoutes';
import userRoutes from './routes/userRoutes';


const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Property Listing API',
    endpoints: {
      properties: '/api/properties',
      users: '/api/users'
    }
  });
});

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;