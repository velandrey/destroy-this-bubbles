import { TPasswordChangeData, TProfile } from '@pages/profile/types';
import {
    getUserData,
    changeProfile,
    changeAvatar,
    changePassword,
    clearUser,
} from '@store/slices/profileSlice';

import { useAppDispatch, useAppSelector } from './redux';

export const useProfile = () => {
    const dispatch = useAppDispatch();
    const { user, isAuth, isLoading, error } = useAppSelector(
        (state) => state.profile
    );

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
        logout: () => dispatch(clearUser()),
    };
};
