import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { gameSlice } from './slices/gameSlice';
import { loadingSlice } from './slices/loadingSlice';
import { notificationSlice } from './slices/notificationSlice';
import { profileSlice } from './slices/profileSlice';

declare global {
    interface Window {
        __INITIAL_STATE__?: TRootState;
    }
}

const rootReducer = combineSlices(
    gameSlice,
    loadingSlice,
    notificationSlice,
    profileSlice
);

export const createStore = (preloadedState?: Partial<TRootState>) =>
    configureStore({
        reducer: rootReducer,
        preloadedState,
    });

export type TAppStore = ReturnType<typeof createStore>;
export type TRootState = ReturnType<typeof rootReducer>;
export type TAppDispatch = TAppStore['dispatch'];
