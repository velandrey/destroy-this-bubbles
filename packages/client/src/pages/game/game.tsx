import { Page } from '@components/page';
import { Button } from '@mui/material';
import GamePageGameOver from '@pages/game/gameOver/gameOver';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GamePageCountdown } from './countdown';
import { GamePageLauncher } from './launcher';
import styles from './styles.module.scss';

const GamePage = () => {
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(3);
    const [gameState, setGameState] = useState<
        'launcher' | 'countdown' | 'playing' | 'gameOver'
    >('launcher');

    // Состояния для результатов игры
    const [gameResults, setGameResults] = useState({
        score: 0,
        accuracy: 0,
        totalTime: 0,
    });

    const handleGameStart = () => {
        setGameState('countdown');
    };

    // Функция завершения игры
    const handleGameOver = (results: {
        score: number;
        accuracy: number;
        totalTime: number;
    }) => {
        setGameResults(results);
        setGameState('gameOver');
    };

    // Функция перезапуска игры
    const handleRestart = () => {
        setCountdown(3);
        setGameState('countdown');
    };

    // TODO временная эмуляция игрового процесса. После реализации игры код следует удалить.
    useEffect(() => {
        if (gameState === 'playing') {
            // Здесь будет реальная игровая логика
            // Пока эмулируем завершение игры через 5 секунд
            const gameTimer = setTimeout(() => {
                handleGameOver({
                    score: 42,
                    accuracy: 73,
                    totalTime: 31,
                });
            }, 5000);

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
                        onClick={() => navigate('/menu')}
                    >
                        Назад к меню
                    </Button>
                </div>
            )}

            {gameState === 'gameOver' && (
                <GamePageGameOver
                    score={gameResults.score}
                    accuracy={gameResults.accuracy}
                    totalTime={gameResults.totalTime}
                    onRestart={handleRestart}
                />
            )}
        </Page>
    );
};

export default GamePage;
