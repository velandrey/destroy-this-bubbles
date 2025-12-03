import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const defaultGameSettings = {
    // Размеры мишени
    circle: {
        minRadius: 1, // стартовый радиус при появлении
        maxRadius: 15, // максимальный радиус (до которого растёт)
        growthSpeed: 5, // скорость увеличения радиуса (px в секунду)
        color: 'red',
        totalLevels: 10, // уровней попадания по мешени(радиус делится на сколько зон?);
        totalTimeLevels: 10, // уровней попадания по времени
    },

    // Спавн мишеней
    spawn: {
        interval: 1000, // время между появлениями (мс)
        maxCircles: 5, // максимальное количество активных кругов
    },

    // Параметры игры
    game: {
        backgroundColor: '#111', // фон канваса
        scoreOnHit: 10, // очки за попадание
        scoreOnMiss: 10, // штраф за промах
        gameDuration: 30000, //продолжительность игры в мс
    },
};

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
