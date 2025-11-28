import { NumberField } from '@components/numberField';
import { GAME_DESCRIPTION } from '@constants/constants';
import { ROUTES } from '@constants/routes';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Button, List, ListItem, ListItemText, Slider } from '@mui/material';
import {
    updateGameDuration,
    updateGrowthSpeed,
    updateMaxCircles,
    updateMaxRadius,
    updateSpawnInterval,
    resetSettings,
} from '@store/slices/gameSlice';
import { useNavigate } from 'react-router-dom';

import { DURATION_MARKS, mockLastTryPart } from './constants';
import styles from './styles.module.scss';

type TProps = {
    handleGameStart: () => void;
};

const GamePageLauncher = ({ handleGameStart }: TProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { circle, spawn, game } = useAppSelector(
        (state) => state.game.settings
    );

    return (
        <div className={styles.container}>
            <div className={styles.configurationPart}>
                <nav>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate(ROUTES.MENU)}
                    >
                        Главное меню
                    </Button>
                </nav>
                <div className={styles.settings}>
                    <h2>Настройки игры</h2>
                    <List>
                        <ListItem>
                            <ListItemText primary="Максимальный размер мишени (пикс)" />
                            <NumberField
                                className={styles.numberInput}
                                value={circle.maxRadius}
                                size="small"
                                min={15}
                                max={50}
                                step={5}
                                onValueChange={(value) => {
                                    if (value) {
                                        dispatch(updateMaxRadius(+value));
                                    }
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Скорость роста мишени (пикс/сек)" />
                            <NumberField
                                className={styles.numberInput}
                                value={circle.growthSpeed}
                                size="small"
                                min={5}
                                max={15}
                                step={5}
                                onValueChange={(value) => {
                                    if (value) {
                                        dispatch(updateGrowthSpeed(+value));
                                    }
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Максимальное кол-во мишеней" />
                            <NumberField
                                className={styles.numberInput}
                                value={spawn.maxCircles}
                                size="small"
                                min={5}
                                max={20}
                                step={1}
                                onValueChange={(value) => {
                                    if (value) {
                                        dispatch(updateMaxCircles(+value));
                                    }
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Интервал спавна мишеней (сек)" />
                            <NumberField
                                className={styles.numberInput}
                                value={spawn.interval / 1000}
                                size="small"
                                min={1}
                                max={5}
                                step={1}
                                onValueChange={(value) => {
                                    if (value) {
                                        dispatch(
                                            updateSpawnInterval(+value * 1000)
                                        );
                                    }
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                secondary={
                                    <Slider
                                        value={game.gameDuration / 1000}
                                        valueLabelDisplay="off"
                                        shiftStep={10}
                                        step={10}
                                        marks={DURATION_MARKS}
                                        min={10}
                                        max={100}
                                        onChange={(_, value) =>
                                            dispatch(
                                                updateGameDuration(
                                                    +value * 1000
                                                )
                                            )
                                        }
                                    />
                                }
                                primary="Продолжительность игры"
                            />
                        </ListItem>
                        <ListItem>
                            <Button
                                fullWidth
                                className={styles.resetSettingsButton}
                                variant="contained"
                                color="primary"
                                onClick={() => dispatch(resetSettings())}
                            >
                                По умолчанию
                            </Button>
                        </ListItem>
                    </List>
                </div>
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
