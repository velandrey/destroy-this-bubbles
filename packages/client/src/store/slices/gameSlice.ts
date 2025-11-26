import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TGameSettings = {
    mode: 'classic' | 'timeAttack';
    difficulty: 'easy' | 'medium' | 'hard';
    bubbleSpeed: number;
    bubbleSpawnRate: number;
    gameDuration: number;
};

export type TGameResults = {
    score: number;
    accuracy: number;
    totalTime: number;
};

type TGameState = {
    results: TGameResults | null;
    isGameActive: boolean;
    settings: TGameSettings;
};

const initialState: TGameState = {
    results: null,
    isGameActive: false,
    settings: {
        mode: 'classic',
        difficulty: 'medium',
        bubbleSpeed: 1,
        bubbleSpawnRate: 1,
        gameDuration: 60,
    },
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
        updateGameSettings: (
            state,
            action: PayloadAction<Partial<TGameSettings>>
        ) => {
            state.settings = { ...state.settings, ...action.payload };
        },
        resetGameSettings: (state) => {
            state.settings = initialState.settings;
        },
    },
});

export const {
    setGameResults,
    startGame,
    resetGame,
    updateGameScore,
    updateGameSettings,
    resetGameSettings,
} = gameSlice.actions;
export default gameSlice.reducer;
