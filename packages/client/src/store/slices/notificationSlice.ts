import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Notification = {
    id: string;
    message: string;
    severity: AlertColor;
    autoHideDuration?: number;
};

type NotificationState = {
    notifications: Notification[];
};

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (
            state,
            action: PayloadAction<Omit<Notification, 'id'>>
        ) => {
            const id = Math.random().toString(36).substring(2, 9);
            state.notifications.push({
                id,
                ...action.payload,
            });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const { addNotification, removeNotification, clearAllNotifications } =
    notificationSlice.actions;
export default notificationSlice.reducer;
