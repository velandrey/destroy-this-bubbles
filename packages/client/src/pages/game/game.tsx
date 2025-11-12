import { Page } from '@components/page';
import { accordionActionsClasses, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

const descriptionPart = {
    name: 'Destroy This Bubbles',
    rules: [
        'Щёлкните по пузырям, чтобы уничтожить их',
        'Чем больше пузырей уничтожаете, тем больше очков вы получаете',
        'За пропущенные пузыри вы теряете очки',
    ],
};

const lastTryPart = {
    lastGamesScore: [
        {
            date: '12.11.2025 12:00',
            score: 100,
            accuracy: 100,
        },
        {
            date: '11.11.2025 12:00',
            score: 76,
            accuracy: 95,
        },
        {
            date: '10.11.2025 12:00',
            score: 50,
            accuracy: 80,
        },
        {
            date: '09.11.2025 12:00',
            score: 25,
            accuracy: 70,
        },
    ],
};

const GamePage = () => {
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(3);
    const [gameState, setGameState] = useState<
        'idle' | 'countdown' | 'playing'
    >('idle');

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

    const handleGameStart = () => {
        setGameState('countdown');
    };

    return (
        <Page className={styles.container}>
            {gameState === 'idle' && (
                <>
                    <div className={styles.descriptionPart}>
                        <ul className={styles.list}>
                            {descriptionPart.rules.map((rule) => (
                                <li key={rule}>{rule}</li>
                            ))}
                        </ul>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/menu')}
                        >
                            Назад к меню
                        </Button>
                    </div>
                    <div className={styles.startPart}>
                        <div
                            className={styles.gameTitle}
                            onClick={handleGameStart}
                        >
                            {descriptionPart.name}
                        </div>
                    </div>
                    <div className={styles.lastTryPart}>
                        <h2 className={styles.title}>Предыдущие игры</h2>
                        {lastTryPart.lastGamesScore.map((game) => (
                            <div key={game.date}>
                                <p className={styles.date}>{game.date}</p>
                                <p className={styles.info}>
                                    Очки: {game.score}
                                </p>
                                <p className={styles.info}>
                                    Точность: {game.accuracy}%
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {gameState === 'countdown' && <div>{countdown}</div>}

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
