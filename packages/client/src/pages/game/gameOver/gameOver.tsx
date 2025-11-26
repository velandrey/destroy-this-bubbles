// game-over.tsx
import { ROUTES } from '@constants/routes';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

type TProps = {
    score: number;
    accuracy: number;
    totalTime: number;
    onRestart: () => void;
};

const GamePageGameOver = ({
    score,
    accuracy,
    totalTime,
    onRestart,
}: TProps) => {
    const navigate = useNavigate();

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box className={styles.gameOverContainer}>
            <Paper className={styles.gameOverPaper}>
                <Typography
                    variant="h3"
                    component="h1"
                    className={styles.gameOverTitle}
                >
                    Игра завершена!
                </Typography>

                <Box className={styles.resultsContainer}>
                    <Box className={styles.resultItem}>
                        <span className={styles.resultLabel}>Счёт:</span>
                        <span className={styles.resultValue}>{score}</span>
                    </Box>
                    <Box className={styles.resultItem}>
                        <span className={styles.resultLabel}>Точность:</span>
                        <span className={styles.resultValue}>{accuracy}%</span>
                    </Box>
                    <Box className={styles.resultItem}>
                        <span className={styles.resultLabel}>Время:</span>
                        <span className={styles.resultValue}>
                            {formatTime(totalTime)}
                        </span>
                    </Box>
                </Box>

                <Box className={styles.actionsBox}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={onRestart}
                        className={styles.actionButton}
                    >
                        Играть снова
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate(ROUTES.MENU)}
                        className={styles.actionButton}
                    >
                        В главное меню
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default GamePageGameOver;
