import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApi } from '@utils/fetchApi';

const LIMIT = 10;

export type TScoreRecord = {
    score: number;
    userLogin: string;
};

export type TGetAllOptions = {
    reset?: boolean;
    limit?: number;
};

type TRawResultItem = {
    data: Record<string, string | number>;
};

type TLeaderboardState = {
    records: TScoreRecord[];
    isLoading: boolean;
    error: string | null;
    cursor: number;
    limit: number;
    hasMore: boolean;
};

const initialState: TLeaderboardState = {
    records: [],
    isLoading: false,
    error: null,
    cursor: 0,
    limit: LIMIT,
    hasMore: true,
};

export const setRecord = createAsyncThunk(
    'leaderboard/setRecord',
    async (payload: TScoreRecord): Promise<void> => {
        await fetchApi('/leaderboard', {
            method: 'POST',
            data: {
                data: {
                    destroyBubblesScore: payload.score,
                    userLogin: payload.userLogin,
                },
                ratingFieldName: 'destroyBubblesScore',
            },
        });
    }
);

export const getLeaderBoard = createAsyncThunk(
    'leaderboard/getLeaderBoard',
    async (
        props: TGetAllOptions | undefined,
        thunkApi
    ): Promise<TScoreRecord[]> => {
        const state = thunkApi.getState() as { leaderboard: TLeaderboardState };
        const cursor = props?.reset ? 0 : state.leaderboard.cursor;
        const limit = props?.limit ?? state.leaderboard.limit;
        const result = await fetchApi('/leaderboard/all', {
            method: 'POST',
            data: {
                ratingFieldName: 'destroyBubblesScore',
                cursor,
                limit,
            },
        });

        return (result as TRawResultItem[]).map((item) => ({
            score: Number(item.data.destroyBubblesScore),
            userLogin: String(item.data.userLogin || ''),
        }));
    }
);

export const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(setRecord.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(setRecord.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(setRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Ошибка сохранения результата';
            })

            .addCase(getLeaderBoard.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                if (action.meta.arg?.limit) {
                    state.limit = action.meta.arg.limit;
                }
                if (action.meta.arg?.reset) {
                    state.records = [];
                    state.cursor = 0;
                    state.hasMore = true;
                }
            })
            .addCase(getLeaderBoard.fulfilled, (state, action) => {
                state.isLoading = false;
                const reset = action.meta.arg?.reset ?? false;
                const limit = action.meta.arg?.limit ?? state.limit;

                if (reset) {
                    state.records = [];
                    state.cursor = 0;
                    state.hasMore = true;
                } else {
                    state.records = [...state.records, ...action.payload];
                    state.cursor += action.payload.length;
                    state.hasMore = action.payload.length >= limit;
                }
            })
            .addCase(getLeaderBoard.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Ошибка получения таблицы лидеров';
            });
    },
});

export default leaderboardSlice.reducer;
