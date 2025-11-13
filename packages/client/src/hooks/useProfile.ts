import { ApiURL } from '@constants/api';
import { IProfile } from '@constants/profile';

interface IPasswordChangeData {
    oldPassword: string;
    newPassword: string;
}

interface UseProfileReturn {
    auth: () => Promise<void>;
    getUserData: () => Promise<IProfile>;
    changeProfile: (profileData: IProfile) => Promise<boolean>;
    changeAvatar: (file: File) => Promise<boolean>;
    changePassword: (passwordData: IPasswordChangeData) => Promise<boolean>;
}

export const useProfile = (): UseProfileReturn => {
    const auth = async (): Promise<void> => {
        const authData = {
            login: 'krokodildil',
            password: '!QAZ2wsx',
        };
        const response = await fetch(`${ApiURL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(authData),
            mode: 'cors',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const getUserData = async (): Promise<IProfile> => {
        try {
            const response = await fetch(`${ApiURL}/auth/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const profileData = await response.json();
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
        } catch (error) {
            console.log(error, 'Error fetching user data');
            throw error;
        }
    };

    const changeProfile = async (profileData: IProfile): Promise<boolean> => {
        try {
            const response = await fetch(`${ApiURL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(profileData),
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Обновляем локальные данные после успешного изменения
            await getUserData();
            return true;
        } catch (error) {
            console.log(error, 'Error updating profile');
            return false;
        }
    };

    const changeAvatar = async (file: File): Promise<boolean> => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${ApiURL}/user/profile/avatar`, {
                method: 'PUT',
                body: formData,
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.log(error, 'Error updating avatar');
            return false;
        }
    };

    const changePassword = async (
        passwordData: IPasswordChangeData
    ): Promise<boolean> => {
        try {
            const response = await fetch(`${ApiURL}/user/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(passwordData),
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.log(error, 'Error changing password');
            return false;
        }
    };

    return {
        auth,
        getUserData,
        changeProfile,
        changeAvatar,
        changePassword,
    };
};
