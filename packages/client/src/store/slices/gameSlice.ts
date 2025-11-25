import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TGameResults = {
    score: number;
    accuracy: number;
    totalTime: number;
};

type TGameState = {
    results: TGameResults | null;
    isGameActive: boolean;
};

const initialState: TGameState = {
    results: null,
    isGameActive: false,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameResults: (state, action: PayloadAction<TGameResults>) => {
            state.results = action.payload;
            state.isGameActive = false;
        },
        startGame: (state) => {
            state.isGameActive = true;
            state.results = null;
        },
        resetGame: (state) => {
            state.results = null;
            state.isGameActive = false;
        },
        updateGameScore: (
            state,
            action: PayloadAction<Partial<TGameResults>>
        ) => {
            if (state.results) {
                state.results = { ...state.results, ...action.payload };
            }
        },
    },
});

export const { setGameResults, startGame, resetGame, updateGameScore } =
    gameSlice.actions;
export default gameSlice.reducer;
