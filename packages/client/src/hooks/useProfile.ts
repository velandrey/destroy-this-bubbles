import { ApiURL } from '@constants/constants';
import { useAppDispatch } from '@hooks/redux';
import { TPasswordChangeData, TProfile } from '@pages/profile/types';
import { clearUser, setUser, updateUser } from '@store/slices/userSlice';
import { fetchApi } from '@utils/fetchApi';

export const useProfile = () => {
    const dispatch = useAppDispatch();
    const auth = async (login: string, password: string) => {
        return fetchApi('/auth/signin', {
            method: 'POST',
            data: { login, password },
        });
    };

    const getUserData = async (): Promise<TProfile> => {
        const userData = await fetchApi<TProfile>('/auth/user');

        if (!userData || typeof userData !== 'object') {
            throw new Error('Invalid profile data received');
        }
        const userProfile: TProfile = {
            first_name: userData.first_name || '',
            second_name: userData.second_name || '',
            display_name: userData.display_name || '',
            phone: userData.phone || '',
            login: userData.login || '',
            avatar: userData.avatar
                ? ApiURL + '/resources' + userData.avatar
                : '',
            email: userData.email || '',
        };
        dispatch(setUser(userProfile));

        return userProfile;
    };

    const changeProfile = async (profileData: TProfile) => {
        const result = await fetchApi('/user/profile', {
            method: 'PUT',
            data: profileData,
        });
        if (result) {
            dispatch(updateUser(profileData));
        }
        return result;
    };

    const changeAvatar = async (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);

        return await fetchApi('/user/profile/avatar', {
            method: 'PUT',
            data: formData,
            isFormData: true,
        });
    };

    const changePassword = async (passwordData: TPasswordChangeData) => {
        return await fetchApi('/user/password', {
            method: 'PUT',
            data: passwordData,
        });
    };

    const logout = () => {
        dispatch(clearUser());
    };

    return {
        auth,
        logout,
        getUserData,
        changeProfile,
        changeAvatar,
        changePassword,
    };
};
