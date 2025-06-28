
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import productReducer from './ProductSlice.js'
export const store = configureStore({
  reducer: {
    user:userReducer,
    product:productReducer
  },
})