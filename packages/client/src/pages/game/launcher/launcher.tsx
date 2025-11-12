import React from 'react';
import styles from './styles.module.scss';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const descriptionPart = {
    name: 'Destroy This Bubbles',
    rules: [
        'Щёлкните по пузырям, чтобы уничтожить их',
        'Чем больше пузырей уничтожаете, тем больше очков вы получаете',
        'За пропущенные пузыри вы теряете очки',
    ],
};

const mockLastTryPart = {
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
    ],
};

type TProps = {
    handleGameStart: () => void;
};

const GamePageLauncher = ({ handleGameStart }: TProps) => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.descriptionPart}>
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
                <div className={styles.gameTitle} onClick={handleGameStart}>
                    {descriptionPart.name}
                </div>
            </div>
            <div className={styles.lastTryPart}>
                <h2 className={styles.title}>Предыдущие игры</h2>
                {mockLastTryPart.lastGamesScore.map((game) => (
                    <div key={game.date}>
                        <p className={styles.date}>{game.date}</p>
                        <p className={styles.info}>Очки: {game.score}</p>
                        <p className={styles.info}>
                            Точность: {game.accuracy}%
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GamePageLauncher;
