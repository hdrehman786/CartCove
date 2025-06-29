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
import imgUploader from './routes/uploadImgRoute.js';
import productRouter from './routes/productRoute.js';
import AddressRoute from './routes/addressRoute.js';
import orderRoute from './routes/orderRoute.js';

dotenv.config();

// establish DB connection once
connectDB();

const app = express();

// 1. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Cookie parsing
app.use(cookieParser());

// 3. CORS — allow your exact Vercel front‑end origin
app.use(cors({
  origin: 'https://cart-cove-e-comerace.vercel.app',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

// 4. Security & logging
app.use(morgan('dev'));
app.use(helmet({ crossOriginResourcePolicy: false }));

// 5. Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// 6. Routes
app.use('/auth', userRouter);
app.use('/api', categoryRouter);
app.use('/file', imgUploader);
app.use('/products', productRouter);
app.use('/address', AddressRoute);
app.use('/order', orderRoute);

// 7. Export as a Vercel serverless function
export const handler = serverless(app);
