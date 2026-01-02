import { ApiURL } from '@constants/constants';
import { TProfile } from '@pages/profile/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserData } from '@store/slices/profileSlice';
import { fetchApi } from '@utils/fetchApi';

export type TUserSearchResult = {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    avatar?: string;
};

type TLogin = string;

type TUsersState = {
    byLogin: Record<TLogin, TUserSearchResult | undefined>;
    isLoading: boolean;
    error: string | null;
};

const initialState: TUsersState = {
    byLogin: {},
    isLoading: false,
    error: null,
};

type TUserByLoginEntry = {
    login: string;
    user?: TUserSearchResult;
};

const mapProfileToUserSearchResult = (profile: TProfile): TUserSearchResult => {
    return {
        first_name: profile.first_name,
        second_name: profile.second_name,
        display_name: profile.display_name,
        login: profile.login,
        avatar: profile.avatar,
    };
};

export const fetchUsersByLogins = createAsyncThunk(
    'users/fetchUsersByLogins',
    async (logins: string[], thunkApi): Promise<TUserByLoginEntry[]> => {
        const state = thunkApi.getState() as { users: TUsersState };
        const missingLogins = logins.filter(
            (login) => !state.users.byLogin[login]
        );
        if (missingLogins.length === 0) {
            return [];
        }

        return Promise.all(
            missingLogins.map(async (login) => {
                const rawUsers =
                    (await fetchApi<TProfile[]>('/user/search', {
                        method: 'POST',
                        data: {
                            login,
                        },
                    })) || [];
                const usersArray = Array.isArray(rawUsers) ? rawUsers : [];
                const rawUser = usersArray[0];

                if (!rawUser) {
                    return { login, user: undefined };
                }

                const user: TUserSearchResult = {
                    first_name: rawUser.first_name,
                    second_name: rawUser.second_name,
                    display_name: rawUser.display_name,
                    login: rawUser.login,
                    avatar: rawUser.avatar
                        ? ApiURL + '/resources' + rawUser.avatar
                        : '',
                };

                return { login, user };
            })
        );
    }
);

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersByLogins.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsersByLogins.fulfilled, (state, action) => {
                state.isLoading = false;
                action.payload.forEach((user) => {
                    state.byLogin[user.login] = user.user;
                });
            })
            .addCase(fetchUsersByLogins.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message ||
                    'Ошибка получения данных пользователя';
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                const login = action.payload.login;
                if (!login) {
                    return;
                }

                state.byLogin[login] = mapProfileToUserSearchResult(
                    action.payload
                );
            });
    },
});

export default usersSlice.reducer;
