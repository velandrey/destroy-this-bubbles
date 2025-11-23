import { useAppSelector } from '@hooks/redux';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

import styles from './styles.module.scss';

const LoadingSpinner = () => {
    const { isLoading, loadingText } = useAppSelector((state) => state.loading);

    if (!isLoading) return null;

    return (
        <Backdrop className={styles.loading_backdrop} open={isLoading}>
            <Box className={styles.loading_box}>
                <CircularProgress color="inherit" />
                {loadingText && (
                    <Typography variant="h6" component="div">
                        {loadingText}
                    </Typography>
                )}
            </Box>
        </Backdrop>
    );
};

export default LoadingSpinner;
