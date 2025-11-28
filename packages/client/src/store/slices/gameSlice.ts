import { defaultGameSettings } from '@game/config/defaultGameSettings';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TGameResults = {
    score: number;
    timestamp: string;
};

export type TGameSettings = {
    circle: {
        minRadius: number;
        maxRadius: number;
        growthSpeed: number;
        color: string;
        totalLevels: number;
        totalTimeLevels: number;
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
    lastResults: Array<TGameResults>;
    settings: TGameSettings;
    isGameActive: boolean;
};

const initialState: TGameState = {
    results: null,
    lastResults: [],
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
        addLastResult: (state, action: PayloadAction<TGameResults>) => {
            state.lastResults.push(action.payload);
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
    addLastResult,
    startGame,
    resetGame,
    resetSettings,
    updateMaxRadius,
    updateGrowthSpeed,
    updateMaxCircles,
    updateSpawnInterval,
    updateGameDuration,
} = gameSlice.actions;
export default gameSlice.reducer;
