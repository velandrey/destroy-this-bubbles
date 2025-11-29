import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { useFullscreen } from '@hooks/useFullscreen';
import { useGame } from '@hooks/useGame';
import { Button } from '@mui/material';
import { TGameResults } from '@store/slices/gameSlice';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameEnter } from '../../game/components';

import { GamePageCountdown } from './countdown';
import GamePageGameOver from './gameOver/gameOver';
import { GamePageLauncher } from './launcher';
import styles from './styles.module.scss';

const GamePage = () => {
    const navigate = useNavigate();
    const { setGameResults, startGame, resetGame } = useGame(); // Состояния для результатов игры
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

    const backToMenu = () => {
        close();
        navigate(ROUTES.MENU);
    };

    // Функция завершения игры
    const handleGameOver = (results: TGameResults) => {
        setGameResults(results);
        setGameState('gameOver');
        exit();
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
            enter(gameRef.current);

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
                            onClick={backToMenu}
                        >
                            Назад к меню
                        </Button>
                        <GameEnter />
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
