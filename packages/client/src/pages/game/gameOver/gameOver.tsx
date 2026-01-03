// game-over.tsx
import { ROUTES } from '@constants/routes';
import { useAppSelector } from '@hooks/redux';
import { useGame } from '@hooks/useGame';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

type TProps = {
    onRestart: () => void;
};

const GamePageGameOver = ({ onRestart }: TProps) => {
    const navigate = useNavigate();
    const { results } = useGame();
    const { lastResults } = useAppSelector((state) => state.game);
    const { score } = results || {
        score: 0,
    };
    const recentResults = lastResults.slice(-6, -1).reverse();

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
                    {recentResults.length > 0 && (
                        <Box className={styles.previousResults}>
                            <Typography
                                variant="subtitle1"
                                className={styles.previousResultsTitle}
                            >
                                Предыдущие игры
                            </Typography>
                            <Box className={styles.previousResultsList}>
                                {recentResults.map((result, index) => (
                                    <Box
                                        key={`${result.timestamp}-${index}`}
                                        className={styles.previousResultsItem}
                                    >
                                        <span
                                            className={
                                                styles.previousResultsDate
                                            }
                                        >
                                            {result.timestamp}
                                        </span>
                                        <span
                                            className={
                                                styles.previousResultsScore
                                            }
                                        >
                                            {result.score}
                                        </span>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
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
                        onClick={() => navigate(ROUTES.LEADERBOARD)}
                        className={styles.actionButton}
                    >
                        Таблица лидеров
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
