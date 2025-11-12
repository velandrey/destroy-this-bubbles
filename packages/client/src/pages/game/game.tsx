import { Page } from '@components/page';
import { accordionActionsClasses, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

const descriptionPart = {
    name: 'Destroy This Bubbles',
    description:
        'Уничтожай все пузыри, которые только можешь заметить! Делай это как можно быстрее и точнее, тогда ты станешь самым ловким стрелком на Диком Западе!',
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

    return (
        <Page className={styles.container}>
            <div className={styles.descriptionPart}>
                <p>{descriptionPart.description}</p>
                <ul className={styles.list}>
                    {descriptionPart.rules.map((rule) => (
                        <li key={rule}>{rule}</li>
                    ))}
                </ul>
                <Button variant="outlined" onClick={() => navigate('/menu')}>
                    Назад к меню
                </Button>
            </div>
            <div className={styles.startPart}>
                <div className={styles.gameTitle}>{descriptionPart.name}</div>
            </div>
            <div className={styles.lastTryPart}>
                <p className={styles.title}>Предыдущие игры</p>
                {lastTryPart.lastGamesScore.map((game) => (
                    <div key={game.date}>
                        <p className={styles.date}>{game.date}</p>
                        <p className={styles.info}>Очки: {game.score}</p>
                        <p className={styles.info}>
                            Точность: {game.accuracy}%
                        </p>
                    </div>
                ))}
            </div>
        </Page>
    );
};

export default GamePage;
