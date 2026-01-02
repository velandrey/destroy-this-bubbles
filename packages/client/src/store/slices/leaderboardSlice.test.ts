import { configureStore } from '@reduxjs/toolkit';
import { fetchApi } from '@utils/fetchApi';

import leaderboardReducer, {
    getLeaderBoard,
    setRecord,
} from './leaderboardSlice';

jest.mock('@utils/fetchApi', () => ({
    fetchApi: jest.fn(),
}));

const mockedFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

describe('leaderboardSlice', () => {
    beforeEach(() => {
        mockedFetchApi.mockReset();
    });

    test('setRecord posts leaderboard entry and clears loading', async () => {
        mockedFetchApi.mockResolvedValueOnce(undefined);

        const store = configureStore({
            reducer: { leaderboard: leaderboardReducer },
        });

        const payload = {
            score: 123,
            userLogin: 'player-one',
        };

        await store.dispatch(setRecord(payload));

        expect(mockedFetchApi).toHaveBeenCalledWith('/leaderboard', {
            method: 'POST',
            data: {
                data: {
                    destroyBubblesScore: payload.score,
                    userLogin: payload.userLogin,
                },
                ratingFieldName: 'destroyBubblesScore',
            },
        });

        expect(store.getState().leaderboard.isLoading).toBe(false);
        expect(store.getState().leaderboard.error).toBeNull();
    });

    test('getLeaderBoard uses reset to fetch from begining of list', async () => {
        mockedFetchApi.mockResolvedValueOnce([]);

        const store = configureStore({
            reducer: { leaderboard: leaderboardReducer },
            preloadedState: {
                leaderboard: {
                    records: [{ score: 1, userLogin: 'player-one' }],
                    isLoading: false,
                    error: null,
                    cursor: 1,
                    limit: 10,
                    hasMore: false,
                },
            },
        });

        await store.dispatch(getLeaderBoard({ reset: true, limit: 5 }));

        expect(mockedFetchApi).toHaveBeenCalledWith('/leaderboard/all', {
            method: 'POST',
            data: {
                ratingFieldName: 'destroyBubblesScore',
                cursor: 0,
                limit: 5,
            },
        });

        const state = store.getState().leaderboard;
        expect(state.records).toEqual([]);
        expect(state.cursor).toBe(0);
        expect(state.limit).toBe(5);
        expect(state.hasMore).toBe(true);
    });

    test('getLeaderBoard loads more', async () => {
        mockedFetchApi.mockResolvedValueOnce([
            {
                data: {
                    destroyBubblesScore: 123,
                    userLogin: 'Bob',
                },
            },
            {
                data: {
                    destroyBubblesScore: 120,
                    userLogin: 'Jack',
                },
            },
        ]);

        const store = configureStore({
            reducer: { leaderboard: leaderboardReducer },
            preloadedState: {
                leaderboard: {
                    records: [
                        {
                            score: 987,
                            userLogin: 'one',
                        },
                        {
                            score: 876,
                            userLogin: 'two',
                        },
                        {
                            score: 654,
                            userLogin: 'three',
                        },
                        {
                            score: 543,
                            userLogin: 'four',
                        },
                    ],
                    isLoading: false,
                    error: null,
                    cursor: 4,
                    limit: 4,
                    hasMore: true,
                },
            },
        });

        await store.dispatch(getLeaderBoard());

        const state = store.getState().leaderboard;
        expect(state.records).toHaveLength(6);
        expect(state.records).toStrictEqual([
            { score: 987, userLogin: 'one' },
            { score: 876, userLogin: 'two' },
            { score: 654, userLogin: 'three' },
            { score: 543, userLogin: 'four' },
            { score: 123, userLogin: 'Bob' },
            { score: 120, userLogin: 'Jack' },
        ]);
        expect(state.cursor).toBe(6);
        expect(state.hasMore).toBe(false);
    });
});
