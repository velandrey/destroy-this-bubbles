import { Page } from '@components/page';
import { useFullscreen } from '@hooks/useFullscreen';
import { useGame } from '@hooks/useGame';
import { useLeaderboard } from '@hooks/useLeaderboard';
import { useProfile } from '@hooks/useProfile';
import { Button } from '@mui/material';
import { TGameResults } from '@store/slices/gameSlice';
import React, { useEffect, useState, useRef } from 'react';

import { GameEnter } from '../../game/components';

import { GamePageCountdown } from './countdown';
import GamePageGameOver from './gameOver/gameOver';
import { GamePageLauncher } from './launcher';
import styles from './styles.module.scss';

const GamePage = () => {
    const { setGameResults, startGame, resetGame, addLastResult } = useGame();
    const { setRecord } = useLeaderboard();
    const { user } = useProfile();

    const [countdown, setCountdown] = useState(3);
    const [gameState, setGameState] = useState<
        'launcher' | 'countdown' | 'playing' | 'gameOver'
    >('launcher');
    const gameRef = useRef<HTMLDivElement>(null);
    const { isFullscreen, enter, exit } = useFullscreen<HTMLDivElement>();

    const handleGameStart = () => {
        startGame();
        setGameState('countdown');
    };

    // Функция завершения игры
    const handleGameOver = (results: TGameResults) => {
        if (gameState === 'playing') {
            setGameResults(results);
            setRecord({
                score: results.score,
                userLogin: user?.login || '',
            });
            addLastResult(results);
            setGameState('gameOver');
            exit();
        }
    };

    // Функция перезапуска игры
    const handleRestart = () => {
        resetGame();
        setCountdown(3);
        setGameState('launcher');
    };

    const handleFullscreenToggle = () => {
        if (isFullscreen) {
            exit();
            return;
        }

        enter(gameRef.current);
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
            <div ref={gameRef}>
                <div className={styles.fullscreenAction}>
                    <Button
                        color="info"
                        variant="contained"
                        onClick={handleFullscreenToggle}
                    >
                        {isFullscreen
                            ? 'Выйти из полного экрана'
                            : 'Полный экран'}
                    </Button>
                </div>
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
            </div>
        </Page>
    );
};

export default GamePage;
