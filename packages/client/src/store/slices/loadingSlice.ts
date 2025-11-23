import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TLoadingState = {
    isLoading: boolean;
    loadingText?: string;
};

const initialState: TLoadingState = {
    isLoading: false,
    loadingText: undefined,
};

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
            state.loadingText = undefined;
        },
        setLoadingWithText: (
            state,
            action: PayloadAction<{ isLoading: boolean; text?: string }>
        ) => {
            state.isLoading = action.payload.isLoading;
            state.loadingText = action.payload.text;
        },
        clearLoading: (state) => {
            state.isLoading = false;
            state.loadingText = undefined;
        },
    },
});

export const { setLoading, setLoadingWithText, clearLoading } =
    loadingSlice.actions;
export default loadingSlice.reducer;
