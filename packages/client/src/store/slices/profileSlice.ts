import { ApiURL } from '@constants/constants';
import { TProfile, TPasswordChangeData } from '@pages/profile/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApi } from '@utils/fetchApi';

type TProfileState = {
    user: TProfile | null;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;
};

const initialState: TProfileState = {
    user: null,
    isAuth: false,
    isLoading: true,
    error: null,
};

export const getUserData = createAsyncThunk(
    'profile/getUserData',
    async (): Promise<TProfile> => {
        const userData = await fetchApi<TProfile>('/auth/user');

        if (!userData || typeof userData !== 'object') {
            throw new Error('Invalid profile data received');
        }

        return {
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
    }
);

export const changeProfile = createAsyncThunk(
    'profile/changeProfile',
    async (profileData: TProfile): Promise<TProfile> => {
        const result = await fetchApi('/user/profile', {
            method: 'PUT',
            data: profileData,
        });

        if (!result) {
            throw new Error('Ошибка обновления профиля');
        }

        return profileData;
    }
);

export const changeAvatar = createAsyncThunk(
    'profile/changeAvatar',
    async (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);

        return await fetchApi<{ avatar: string }>('/user/profile/avatar', {
            method: 'PUT',
            data: formData,
            isFormData: true,
        });
    }
);

export const changePassword = createAsyncThunk(
    'profile/changePassword',
    async (passwordData: TPasswordChangeData): Promise<void> => {
        const result = await fetchApi('/user/password', {
            method: 'PUT',
            data: passwordData,
        });

        if (!result) {
            throw new Error('Ошибка изменения пароля');
        }
    }
);

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.isAuth = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getUserData
            .addCase(getUserData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuth = true;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Ошибка получения данных профиля';
                state.isAuth = false;
            })
            // changeProfile
            .addCase(changeProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changeProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(changeProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Ошибка обновления профиля';
            })
            // changeAvatar
            .addCase(changeAvatar.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changeAvatar.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(changeAvatar.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Ошибка обновления аватара';
            })
            // changePassword
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Ошибка обновления пароля';
            });
    },
});

export const { clearUser, clearError } = profileSlice.actions;
export default profileSlice.reducer;
