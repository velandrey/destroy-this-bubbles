import { fetchUsersByLogins } from '@store/slices/usersSlice';
import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from './redux';

export const useUsers = () => {
    const dispatch = useAppDispatch();
    const { byLogin, isLoading, error } = useAppSelector(
        (state) => state.users
    );

    return {
        usersByLogin: byLogin,
        isLoading,
        error,
        fetchUsersByLogins: useCallback(
            (logins: string[]) => dispatch(fetchUsersByLogins(logins)),
            [dispatch]
        ),
    };
};
