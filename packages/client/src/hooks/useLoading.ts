import {
    setLoading,
    setLoadingWithText,
    clearLoading,
} from '@store/slices/loadingSlice';

import { useAppDispatch, useAppSelector } from './redux';

export const useLoading = () => {
    const dispatch = useAppDispatch();
    const { isLoading, loadingText } = useAppSelector((state) => state.loading);

    const startLoading = (text?: string) => {
        if (text) {
            dispatch(setLoadingWithText({ isLoading: true, text }));
        } else {
            dispatch(setLoading(true));
        }
    };

    const stopLoading = () => {
        dispatch(clearLoading());
    };

    return {
        isLoading,
        loadingText,
        startLoading,
        stopLoading,
        setLoading: (loading: boolean, text?: string) => {
            if (loading) {
                startLoading(text);
            } else {
                stopLoading();
            }
        },
    };
};
