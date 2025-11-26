import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { useGame } from '@hooks/useGame';
import { Button } from '@mui/material';
import GamePageGameOver from '@pages/game/gameOver/gameOver';
import { TGameResults } from '@store/slices/gameSlice';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GamePageCountdown } from './countdown';
import { GamePageLauncher } from './launcher';
import styles from './styles.module.scss';

const GamePage = () => {
    const navigate = useNavigate();
    const { setGameResults, startGame, resetGame } = useGame(); // Состояния для результатов игры
    const [countdown, setCountdown] = useState(3);
    const [gameState, setGameState] = useState<
        'launcher' | 'countdown' | 'playing' | 'gameOver'
    >('launcher');

    const handleGameStart = () => {
        startGame();
        setGameState('countdown');
    };

    // Функция завершения игры
    const handleGameOver = (results: TGameResults) => {
        setGameResults(results);
        setGameState('gameOver');
    };

    // Функция перезапуска игры
    const handleRestart = () => {
        resetGame();
        setCountdown(3);
        setGameState('countdown');
    };

    // TODO временная эмуляция игрового процесса. После реализации игры код следует удалить.
    useEffect(() => {
        if (gameState === 'playing') {
            // Здесь будет реальная игровая логика
            // Пока эмулируем завершение игры через 1 секунду
            const gameTimer = setTimeout(() => {
                handleGameOver({
                    score: 42,
                    accuracy: 73,
                    totalTime: 31,
                });
            }, 1000);

            return () => clearTimeout(gameTimer);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'countdown') {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            if (countdown === 0) {
                clearInterval(timer);
                setGameState('playing');
            }

            return () => clearInterval(timer);
        }
    }, [gameState, countdown]);

    return (
        <Page className={styles.container}>
            {gameState === 'launcher' && (
                <GamePageLauncher handleGameStart={handleGameStart} />
            )}

            {gameState === 'countdown' && (
                <GamePageCountdown countdown={countdown} />
            )}

            {gameState === 'playing' && (
                <div>
                    <Button
                        color="success"
                        variant="contained"
                        onClick={() => navigate(ROUTES.MENU)}
                    >
                        Назад к меню
                    </Button>
                </div>
            )}

            {gameState === 'gameOver' && (
                <GamePageGameOver onRestart={handleRestart} />
            )}
        </Page>
    );
};

export default GamePage;
