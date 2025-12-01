// hooks/useGame.ts
import {
    setGameResults,
    startGame,
    resetGame,
    TGameResults,
    addLastResult,
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
        addLastResult: (results: TGameResults) =>
            dispatch(addLastResult(results)),
        startGame: () => dispatch(startGame()),
        resetGame: () => dispatch(resetGame()),
    };
};
