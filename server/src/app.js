import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

import applicationRoutes from './routes/applicationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { getDepartments } from './controllers/applicationController.js';

dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is explicitly allowed or matches a Vercel deployment of the app
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === '*' || allowed === origin) return true;
      
      // Auto-allow Vercel subdomains if the user's main frontend domain is vercel.app
      if (origin.endsWith('.vercel.app') && allowed.includes('vercel.app')) {
        return true;
      }
      return false;
    });

    console.log(`CORS Preflight - Origin: "${origin}" | Allowed: ${isAllowed}`);

    if (isAllowed) {
      callback(null, true);
    } else {
      // Return false instead of throwing a 500 Error to avoid crashing the response headers
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(express.json());

const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many admin requests from this IP, please try again after 15 minutes'
});

app.use('/api/applications', userLimiter, applicationRoutes);
app.get('/api/departments', userLimiter, getDepartments);
app.use('/api/auth', userLimiter, authRoutes);
app.use('/api/admin', adminLimiter, adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
