import { Page } from '@components/page';
import { Button } from '@mui/material';
import Game from 'game/components/Game';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GamePageCountdown } from './countdown';
import { GamePageLauncher } from './launcher';
import styles from './styles.module.scss';

const GamePage = () => {
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(3);
    const [gameState, setGameState] = useState<
        'launcher' | 'countdown' | 'playing'
    >('launcher');

    const handleGameStart = () => {
        setGameState('countdown');
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
                        onClick={() => navigate('/menu')}
                    >
                        Назад к меню
                    </Button>
                    <Game />
                </div>
            )}
        </Page>
    );
};

export default GamePage;
