import { GAME_DESCRIPTION } from '@constants/constants';
import { ROUTES } from '@constants/routes';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { mockLastTryPart } from './mock';
import styles from './styles.module.scss';

type TProps = {
    handleGameStart: () => void;
};

const GamePageLauncher = ({ handleGameStart }: TProps) => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.descriptionPart}>
                <ul className={styles.list}>
                    {GAME_DESCRIPTION.rules.map((rule) => (
                        <li key={rule}>{rule}</li>
                    ))}
                </ul>
                <Button
                    variant="outlined"
                    onClick={() => navigate(ROUTES.MENU)}
                >
                    Назад к меню
                </Button>
            </div>
            <div className={styles.startPart}>
                <div className={styles.gameTitle} onClick={handleGameStart}>
                    {GAME_DESCRIPTION.name}
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
