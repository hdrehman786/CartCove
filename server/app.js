// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import connectDB from './config/connectDB.js';
import userRouter from './routes/userRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import subcategoryRouter from './routes/subcategoryRoute.js';
import imgUploader from './routes/uploadImgRoute.js';
import productRouter from './routes/productRoute.js';
import AddressRoute from './routes/addressRoute.js';
import orderRoute from './routes/orderRoute.js';

// Load environment variables
dotenv.config();

// Connect to database once on startup
connectDB();

// Frontend origin for CORS
const FRONTEND ='https://cart-cove-e-comerace.vercel.app/';

const app = express();

// 1. CORS: handle all requests and OPTIONS before anything else
app.use(cors({
  origin: FRONTEND,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));
app.options('*', cors({ origin: FRONTEND, credentials: true }));

// 2. Body parsing and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Security & logging
app.use(morgan('dev'));
app.use(helmet({ crossOriginResourcePolicy: false }));

// 4. Health check
app.get('/', (_req, res) => {
  res.json({ message: 'API is running...' });
});

// 5. Routes
app.use('/auth',userRouter);
app.use('/api/categories',categoryRouter);
app.use('/api/subcategories',subcategoryRouter);
app.use('/file', imgUploader);
app.use('/products', productRouter);
app.use('/address', AddressRoute);
app.use('/order', orderRoute);

// 6. Export handler for Vercel
export const handler = serverless(app);
