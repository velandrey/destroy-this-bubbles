import {
    setGameResults,
    startGame,
    resetGame,
    updateGameScore,
} from '@store/slices/gameSlice';

import { useAppDispatch, useAppSelector } from './redux';

export const useGame = () => {
    const dispatch = useAppDispatch();
    const { results, isGameActive } = useAppSelector((state) => state.game);

    return {
        results,
        isGameActive,
        setGameResults: (results: {
            score: number;
            accuracy: number;
            totalTime: number;
        }) => dispatch(setGameResults(results)),
        startGame: () => dispatch(startGame()),
        resetGame: () => dispatch(resetGame()),
        updateGameScore: (
            updates: Partial<{
                score: number;
                accuracy: number;
                totalTime: number;
            }>
        ) => dispatch(updateGameScore(updates)),
    };
};
