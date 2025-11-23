import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GameResults = {
    score: number;
    accuracy: number;
    totalTime: number;
};

type GameState = {
    results: GameResults | null;
    isGameActive: boolean;
};

const initialState: GameState = {
    results: null,
    isGameActive: false,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameResults: (state, action: PayloadAction<GameResults>) => {
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
            action: PayloadAction<Partial<GameResults>>
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
