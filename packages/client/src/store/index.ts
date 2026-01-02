import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { gameSlice } from '@store/slices/gameSlice';
import { leaderboardSlice } from '@store/slices/leaderboardSlice';
import { loadingSlice } from '@store/slices/loadingSlice';
import { notificationSlice } from '@store/slices/notificationSlice';
import { profileSlice } from '@store/slices/profileSlice';
import { usersSlice } from '@store/slices/usersSlice';

declare global {
    interface Window {
        __INITIAL_STATE__?: TRootState;
    }
}

const rootReducer = combineSlices(
    gameSlice,
    loadingSlice,
    notificationSlice,
    profileSlice,
    leaderboardSlice,
    usersSlice
);

export const createStore = (preloadedState?: Partial<TRootState>) =>
    configureStore({
        reducer: rootReducer,
        preloadedState,
    });

export type TAppStore = ReturnType<typeof createStore>;
export type TRootState = ReturnType<typeof rootReducer>;
export type TAppDispatch = TAppStore['dispatch'];
