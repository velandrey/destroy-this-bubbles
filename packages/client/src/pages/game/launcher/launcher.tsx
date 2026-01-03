import { NumberField } from '@components/numberField';
import { GAME_DESCRIPTION } from '@constants/constants';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Slider,
} from '@mui/material';
import {
    updateGameDuration,
    updateGrowthSpeed,
    updateMaxCircles,
    updateMaxRadius,
    updateSpawnInterval,
    resetSettings,
} from '@store/slices/gameSlice';
import { useState } from 'react';

import { DURATION_MARKS } from './constants';
import styles from './styles.module.scss';

type TProps = {
    handleGameStart: () => void;
};

const GamePageLauncher = ({ handleGameStart }: TProps) => {
    const dispatch = useAppDispatch();
    const { circle, spawn, game } = useAppSelector(
        (state) => state.game.settings
    );
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.startPart}>
                <div className={styles.gameTitle} onClick={handleGameStart}>
                    {GAME_DESCRIPTION.name}
                </div>
                <Button
                    variant="outlined"
                    className={styles.settingsButton}
                    onClick={() => setSettingsOpen(true)}
                >
                    Настройки игры
                </Button>
            </div>
            <Dialog
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Настройки игры</DialogTitle>
                <DialogContent className={styles.settingsDialogContent}>
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
                    </List>
                </DialogContent>
                <DialogActions className={styles.settingsDialogActions}>
                    <Button
                        variant="outlined"
                        onClick={() => dispatch(resetSettings())}
                    >
                        По умолчанию
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setSettingsOpen(false)}
                    >
                        Готово
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default GamePageLauncher;
