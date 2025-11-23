import { AlertColor } from '@mui/material';
import {
    addNotification,
    removeNotification,
    clearAllNotifications,
} from '@store/slices/notificationSlice';

import { useAppDispatch, useAppSelector } from './redux';

export const useNotification = () => {
    const dispatch = useAppDispatch();
    const { notifications } = useAppSelector((state) => state.notification);

    const showNotification = (
        message: string,
        severity: AlertColor = 'info',
        autoHideDuration?: number
    ) => {
        dispatch(addNotification({ message, severity, autoHideDuration }));
    };

    const hideNotification = (id: string) => {
        dispatch(removeNotification(id));
    };

    const clearNotifications = () => {
        dispatch(clearAllNotifications());
    };

    return {
        notifications,
        showNotification,
        hideNotification,
        clearNotifications,
        showError: (message: string, autoHideDuration?: number) =>
            showNotification(message, 'error', autoHideDuration),
        showSuccess: (message: string, autoHideDuration?: number) =>
            showNotification(message, 'success', autoHideDuration),
        showWarning: (message: string, autoHideDuration?: number) =>
            showNotification(message, 'warning', autoHideDuration),
        showInfo: (message: string, autoHideDuration?: number) =>
            showNotification(message, 'info', autoHideDuration),
    };
};
