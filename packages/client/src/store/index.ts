import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from '@store/slices/loadingSlice';
import userReducer from '@store/slices/userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
