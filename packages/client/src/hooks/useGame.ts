// hooks/useGame.ts
import {
    setGameResults,
    startGame,
    resetGame,
    updateGameScore,
    updateGameSettings,
    resetGameSettings,
    TGameResults,
    TGameSettings,
} from '@store/slices/gameSlice';

import { useAppDispatch, useAppSelector } from './redux';

export const useGame = () => {
    const dispatch = useAppDispatch();
    const { results, isGameActive, settings } = useAppSelector(
        (state) => state.game
    );

    return {
        results,
        isGameActive,
        settings,
        setGameResults: (results: TGameResults) =>
            dispatch(setGameResults(results)),
        startGame: () => dispatch(startGame()),
        resetGame: () => dispatch(resetGame()),
        updateGameScore: (updates: Partial<TGameResults>) =>
            dispatch(updateGameScore(updates)),
        updateGameSettings: (updates: Partial<TGameSettings>) =>
            dispatch(updateGameSettings(updates)),
        resetGameSettings: () => dispatch(resetGameSettings()),
    };
};
