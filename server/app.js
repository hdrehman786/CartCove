// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import connectDB from './config/connectDB.js';
import userRouter      from './routes/userRoute.js';
import categoryRouter  from './routes/categoryRoute.js';
import imgUploader     from './routes/uploadImgRoute.js';
import productRouter   from './routes/productRoute.js';
import AddressRoute    from './routes/addressRoute.js';
import orderRoute      from './routes/orderRoute.js';

dotenv.config();
connectDB();

const FRONTEND = 'https://cart-cove-e-comerace.vercel.app';

const app = express();

// 1. Body + cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. CORS – allow your exact front‑end origin
app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS']
  })
);
// 2b. Preflight for all routes
app.options('*', cors({
  origin: FRONTEND,
  credentials: true,
}));

// 3. Security & logging
app.use(morgan('dev'));
app.use(helmet({ crossOriginResourcePolicy: false }));

// 4. Health check
app.get('/', (_req, res) => {
  res.json({ message: 'API is running…' });
});

// 5. Routes
app.use('/auth',    userRouter);
app.use('/api',     categoryRouter);
app.use('/file',    imgUploader);
app.use('/products',productRouter);
app.use('/address', AddressRoute);
app.use('/order',   orderRoute);

// 6. Export for Vercel
export const handler = serverless(app);
