import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useState, useEffect } from 'react';

interface StatusAlertProps {
    open: boolean;
    message: string;
    severity: AlertColor;
    onClose: () => void;
    autoHideDuration?: number;
}

const StatusAlert = ({
    open,
    message,
    severity,
    onClose,
    autoHideDuration = 10000,
}: StatusAlertProps) => {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
        >
            <Alert severity={severity} onClose={handleClose} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default StatusAlert;
