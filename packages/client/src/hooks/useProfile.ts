import { ROUTES } from '@constants/routes';
import { TPasswordChangeData, TProfile } from '@pages/profile/types';
import {
    getUserData,
    changeProfile,
    changeAvatar,
    changePassword,
    clearUser,
} from '@store/slices/profileSlice';
import { fetchApi } from '@utils/fetchApi';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './redux';
import { useNotification } from './useNotification';

export const useProfile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
    const { user, isAuth, isLoading, error } = useAppSelector(
        (state) => state.profile
    );
    const logout = async () => {
        try {
            await fetchApi('/auth/logout', {
                method: 'POST',
            });
            dispatch(clearUser());
            showSuccess('Вы успешно вышли из аккаунта');
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.error('Ошибка выхода:', error);
            showError('Ошибка при выходе из аккаунта');
        }
    };
    return {
        user,
        isAuth,
        isLoading,
        error,
        getUserData: () => dispatch(getUserData()),
        changeProfile: (profileData: TProfile) =>
            dispatch(changeProfile(profileData)),
        changeAvatar: (file: File) => dispatch(changeAvatar(file)),
        changePassword: (passwordData: TPasswordChangeData) =>
            dispatch(changePassword(passwordData)),
        logout,
    };
};
