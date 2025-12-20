import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '@store/slices/gameSlice';
import notificationReducer from '@store/slices/notificationSlice';
import profileReducer from '@store/slices/profileSlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        profile: profileReducer,
        notification: notificationReducer,
    },
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
