import { useNotification } from '@hooks/useNotification';
import { Snackbar, Alert } from '@mui/material';

type TNotificationContainerProps = {
    autoHideDuration?: number;
};

const NotificationContainer = ({
    autoHideDuration = 6000,
}: TNotificationContainerProps) => {
    const { notifications, hideNotification } = useNotification();

    const handleClose = (id: string) => () => {
        hideNotification(id);
    };

    return (
        <>
            {notifications.map((notification) => (
                <Snackbar
                    key={notification.id}
                    open={true}
                    autoHideDuration={
                        notification.autoHideDuration || autoHideDuration
                    }
                    onClose={handleClose(notification.id)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        severity={notification.severity}
                        onClose={handleClose(notification.id)}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};

export default NotificationContainer;
