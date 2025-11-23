import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '@store/slices/gameSlice';
import loadingReducer from '@store/slices/loadingSlice';
import notificationReducer from '@store/slices/notificationSlice';
import userReducer from '@store/slices/userSlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        loading: loadingReducer,
        notification: notificationReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
