import { Page } from '@components/page';
import { accordionActionsClasses, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import { GamePageLauncher } from './launcher';
import { GamePageCountdown } from './countdown';

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
        </Page>
    );
};

export default GamePage;
