import {
    getLeaderBoard,
    setRecord,
    type TScoreRecord,
    type TGetAllOptions,
} from '@store/slices/leaderboardSlice';
import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from './redux';

export const useLeaderboard = () => {
    const dispatch = useAppDispatch();
    const { records, isLoading, error, hasMore } = useAppSelector(
        (state) => state.leaderboard
    );

    return {
        records,
        isLoading,
        error,
        hasMore,
        setRecord: useCallback(
            (scoreRecord: TScoreRecord) => dispatch(setRecord(scoreRecord)),
            [dispatch]
        ),
        getLeaderBoard: useCallback(
            (params?: TGetAllOptions) => dispatch(getLeaderBoard(params)),
            [dispatch]
        ),
    };
};
