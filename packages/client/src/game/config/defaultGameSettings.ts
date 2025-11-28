export const defaultGameSettings = {
    // Размеры мишени
    circle: {
        minRadius: 1, // стартовый радиус при появлении
        maxRadius: 15, // максимальный радиус (до которого растёт)
        growthSpeed: 5, // скорость увеличения радиуса (px в секунду)
        color: 'red',
    },

    // Спавн мишеней
    spawn: {
        interval: 1000, // время между появлениями (мс)
        maxCircles: 5, // максимальное количество активных кругов
    },

    // Параметры игры
    game: {
        backgroundColor: '#111', // фон канваса
        scoreOnHit: 1, // очки за попадание
        scoreOnMiss: -1, // штраф за промах
        gameDuration: 30000, //продолжительность игры в мс
    },
};
