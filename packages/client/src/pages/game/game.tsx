import { Page } from '@components/page';
import { useGame } from '@hooks/useGame';
import { Button } from '@mui/material';
import { TGameResults } from '@store/slices/gameSlice';
import React, { useEffect, useState } from 'react';

import { GameEnter } from '../../game/components';

import { GamePageCountdown } from './countdown';
import GamePageGameOver from './gameOver/gameOver';
import { GamePageLauncher } from './launcher';
import styles from './styles.module.scss';

const GamePage = () => {
    const { setGameResults, startGame, resetGame, addLastResult } = useGame(); // Состояния для результатов игры
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
        if (gameState === 'playing') {
            setGameResults(results);
            addLastResult(results);
            setGameState('gameOver');
        }
    };

    // Функция перезапуска игры
    const handleRestart = () => {
        resetGame();
        setCountdown(3);
        setGameState('launcher');
    };

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
                <div className={styles.gameContainer}>
                    <Button
                        color="success"
                        variant="contained"
                        onClick={handleRestart}
                    >
                        Начать заново
                    </Button>
                    <GameEnter onGameOver={handleGameOver} />
                </div>
            )}

            {gameState === 'gameOver' && (
                <GamePageGameOver onRestart={handleRestart} />
            )}
        </Page>
    );
};

export default GamePage;
