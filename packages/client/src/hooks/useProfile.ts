import { ApiURL } from '@constants/constants';
import { useApi } from '@hooks/useApi';
import { IProfile } from '@pages/profile/constants';

interface IPasswordChangeData {
    oldPassword: string;
    newPassword: string;
}

export const useProfile = () => {
    const auth = async (login: string, password: string) => {
        return useApi('/auth/signin', {
            method: 'POST',
            data: { login, password },
        });
    };

    const getUserData = async (): Promise<IProfile> => {
        const profileData = await useApi<IProfile>('/auth/user');

        if (!profileData || typeof profileData !== 'object') {
            throw new Error('Invalid profile data received');
        }

        return {
            first_name: profileData.first_name || '',
            second_name: profileData.second_name || '',
            display_name: profileData.display_name || '',
            phone: profileData.phone || '',
            login: profileData.login || '',
            avatar: profileData.avatar
                ? ApiURL + '/resources' + profileData.avatar
                : '',
            email: profileData.email || '',
        };
    };

    const changeProfile = async (profileData: IProfile) => {
        return await useApi('/user/profile', {
            method: 'PUT',
            data: profileData,
        });
    };

    const changeAvatar = async (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);

        return await useApi('/user/profile/avatar', {
            method: 'PUT',
            data: formData,
            isFormData: true,
        });
    };

    const changePassword = async (passwordData: IPasswordChangeData) => {
        return await useApi('/user/password', {
            method: 'PUT',
            data: passwordData,
        });
    };

    return {
        auth,
        getUserData,
        changeProfile,
        changeAvatar,
        changePassword,
    };
};
