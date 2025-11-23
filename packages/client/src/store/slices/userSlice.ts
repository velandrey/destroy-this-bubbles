import { TProfile } from '@pages/profile/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TUserState = {
    user: TProfile | null;
    isAuth: boolean;
};

const initialState: TUserState = {
    user: null,
    isAuth: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<TProfile>) => {
            state.user = action.payload;
            state.isAuth = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuth = false;
        },
        updateUser: (state, action: PayloadAction<Partial<TProfile>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
