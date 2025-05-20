import { configureStore } from "@reduxjs/toolkit";


// Create the store
export const store = configureStore({
  reducer: {
 
  },
});

// Define RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
