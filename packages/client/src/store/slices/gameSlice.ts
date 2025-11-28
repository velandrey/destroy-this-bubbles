import { defaultGameSettings } from '@game/config/defaultGameSettings';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TGameResults = {
    score: number;
};

export type TGameSettings = {
    circle: {
        minRadius: number;
        maxRadius: number;
        growthSpeed: number;
        color: string;
    };
    spawn: {
        interval: number;
        maxCircles: number;
    };
    game: {
        backgroundColor: string;
        scoreOnHit: number;
        scoreOnMiss: number;
        gameDuration: number;
    };
};

type TGameState = {
    results: TGameResults | null;
    settings: TGameSettings;
    isGameActive: boolean;
};

const initialState: TGameState = {
    results: null,
    settings: defaultGameSettings,
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
        resetSettings: (state) => {
            state.settings = initialState.settings;
        },
        updateGameScore: (
            state,
            action: PayloadAction<Partial<TGameResults>>
        ) => {
            if (state.results) {
                state.results = { ...state.results, ...action.payload };
            }
        },
        updateMaxRadius: (state, action: PayloadAction<number>) => {
            state.settings.circle.maxRadius = action.payload;
        },
        updateGrowthSpeed: (state, action: PayloadAction<number>) => {
            state.settings.circle.growthSpeed = action.payload;
        },
        updateMaxCircles: (state, action: PayloadAction<number>) => {
            state.settings.spawn.maxCircles = action.payload;
        },
        updateSpawnInterval: (state, action: PayloadAction<number>) => {
            state.settings.spawn.interval = action.payload;
        },
        updateGameDuration: (state, action: PayloadAction<number>) => {
            state.settings.game.gameDuration = action.payload;
        },
    },
});

export const {
    setGameResults,
    startGame,
    resetGame,
    resetSettings,
    updateGameScore,
    updateMaxRadius,
    updateGrowthSpeed,
    updateMaxCircles,
    updateSpawnInterval,
    updateGameDuration,
} = gameSlice.actions;
export default gameSlice.reducer;
