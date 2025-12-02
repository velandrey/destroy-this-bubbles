import { defaultGameSettings, TGameSettings } from '@store/slices/gameSlice';
import { formatDate } from '@utils/formatDate';
import { checkHit } from 'game/logic/circle/hitLogic';

import FloatingText from '../objects/floatingText';

import {
    GameModel,
    updateFloatingTexts,
    calculateAccuracyLevel,
    calculateSpeedLevel,
    calculateDistance,
} from './gameModel';

type PartialSettings = {
    circle?: Partial<TGameSettings['circle']>;
    spawn?: Partial<TGameSettings['spawn']>;
    game?: Partial<TGameSettings['game']>;
};

type SpawnLogicMockInstance = {
    update: jest.Mock;
};

const spawnLogicInstances: SpawnLogicMockInstance[] = [];

jest.mock('game/logic/circle/spawnLogic', () => ({
    SpawnLogic: jest.fn().mockImplementation(() => {
        const instance: SpawnLogicMockInstance = {
            update: jest.fn(),
        };
        spawnLogicInstances.push(instance);
        return instance;
    }),
}));

jest.mock('game/logic/circle/hitLogic', () => ({
    checkHit: jest.fn(),
}));

jest.mock('@utils/formatDate', () => ({
    formatDate: jest.fn(() => 'formatted-date'),
}));

const createSettings = (overrides: PartialSettings = {}): TGameSettings => ({
    circle: { ...defaultGameSettings.circle, ...overrides.circle },
    spawn: { ...defaultGameSettings.spawn, ...overrides.spawn },
    game: { ...defaultGameSettings.game, ...overrides.game },
});

const buildModel = (overrides?: PartialSettings, handler = jest.fn()) =>
    new GameModel(640, 360, handler, createSettings(overrides));

const getSpawnLogic = () => spawnLogicInstances[spawnLogicInstances.length - 1];

const mockedCheckHit = checkHit as jest.MockedFunction<typeof checkHit>;
const mockedFormatDate = formatDate as jest.MockedFunction<typeof formatDate>;

const mediaPlaySpy = jest
    .spyOn(window.HTMLMediaElement.prototype, 'play')
    .mockImplementation(() => Promise.resolve());

afterAll(() => {
    mediaPlaySpy.mockRestore();
});

describe('GameModel', () => {
    let now = 0;
    let nowSpy: jest.SpyInstance<number, []>;

    beforeEach(() => {
        now = 0;
        spawnLogicInstances.length = 0;
        mockedCheckHit.mockReset();
        jest.clearAllMocks();
        nowSpy = jest.spyOn(performance, 'now').mockImplementation(() => now);
    });

    afterEach(() => {
        nowSpy.mockRestore();
    });

    test('start resets state and initializes timers', () => {
        const model = buildModel();
        (model as unknown as { circles: unknown[] }).circles = [{}, {}];
        (model as unknown as { score: number }).score = 25;
        (model as unknown as { floatingTexts: unknown[] }).floatingTexts = [
            {} as FloatingText,
        ];

        now = 5000;
        model.start();

        const state = model.currentGameState;
        expect(state.isRunning).toBe(true);
        expect(state.isGameOver).toBe(false);
        expect(state.score).toBe(0);
        expect(state.circles).toHaveLength(0);
        expect(state.floatingTexts).toHaveLength(0);
        expect(state.secondsRemaining).toBe(
            Math.round(defaultGameSettings.game.gameDuration / 1000)
        );
    });

    test('update returns early when the game is not running', () => {
        const model = buildModel();
        const spawnLogic = getSpawnLogic();

        model.update(0);

        expect(spawnLogic.update).not.toHaveBeenCalled();
    });

    test('update advances circles, spawn logic and floating texts', () => {
        const model = buildModel();
        const spawnLogic = getSpawnLogic();

        model.start();

        const activeCircle = {
            update: jest.fn(),
            isActive: jest.fn(() => true),
        };
        const inactiveCircle = {
            update: jest.fn(),
            isActive: jest.fn(() => false),
        };
        (model as unknown as { circles: unknown[] }).circles = [
            activeCircle,
            inactiveCircle,
        ];

        const aliveText = {
            update: jest.fn(),
            isAlive: jest.fn(() => true),
        };
        const deadText = {
            update: jest.fn(),
            isAlive: jest.fn(() => false),
        };
        (model as unknown as { floatingTexts: unknown[] }).floatingTexts = [
            aliveText,
            deadText,
        ];

        now = 500;
        model.update(500);

        expect(spawnLogic.update).toHaveBeenCalledWith(
            500,
            expect.arrayContaining([activeCircle, inactiveCircle])
        );
        expect(activeCircle.update).toHaveBeenCalledWith(500);
        expect(inactiveCircle.update).toHaveBeenCalledWith(500);
        expect(activeCircle.isActive).toHaveBeenCalled();
        expect(inactiveCircle.isActive).toHaveBeenCalled();
        expect((model as unknown as { circles: unknown[] }).circles).toEqual([
            activeCircle,
        ]);

        expect(aliveText.update).toHaveBeenCalledWith(500);
        expect(deadText.update).toHaveBeenCalledWith(500);
        expect(
            (model as unknown as { floatingTexts: unknown[] }).floatingTexts
        ).toEqual([aliveText]);
    });

    test('update triggers end game when duration elapses', () => {
        const onGameOver = jest.fn();
        const model = buildModel(undefined, onGameOver);
        const spawnLogic = getSpawnLogic();

        model.start();
        (model as unknown as { score: number }).score = 42;

        now = defaultGameSettings.game.gameDuration;
        model.update(now);

        expect(onGameOver).toHaveBeenCalledWith({
            score: 42,
            timestamp: 'formatted-date',
        });
        expect(mockedFormatDate).toHaveBeenCalledWith(expect.any(Date));
        expect(spawnLogic.update).not.toHaveBeenCalled();

        const state = model.currentGameState;
        expect(state.isRunning).toBe(false);
        expect(state.isGameOver).toBe(true);
        expect(state.secondsRemaining).toBe(0);
        expect(state.circles).toHaveLength(0);
    });

    test('processClick ignores clicks when game is not running', () => {
        const model = buildModel();

        mockedCheckHit.mockReturnValue({ hit: false });
        model.processClick(10, 15);

        expect(mockedCheckHit).not.toHaveBeenCalled();
    });

    test('processClick registers misses and prevents negative score', () => {
        const model = buildModel();

        model.start();
        (model as unknown as { score: number }).score = 5;
        mockedCheckHit.mockReturnValue({ hit: false });

        now = 100;
        model.processClick(25, 30);

        expect(mockedCheckHit).toHaveBeenCalledWith(expect.any(Array), 25, 30);
        expect((model as unknown as { score: number }).score).toBe(0);
    });

    test('processClick registers hits, updates score and floating texts', () => {
        const model = buildModel();
        model.start();

        const circle = {
            x: 40,
            y: 50,
            get lifetime() {
                return 900;
            },
            pop: jest.fn(),
        };
        (model as unknown as { circles: unknown[] }).circles = [circle];

        mockedCheckHit.mockReturnValue({ hit: true, circle: circle as any });

        now = 1000;
        model.processClick(40, 50);

        const gainedScore = 29; // 10 base + 10 accuracy + 9 speed
        expect((model as unknown as { score: number }).score).toBe(gainedScore);
        expect(circle.pop).toHaveBeenCalled();

        const state = model.currentGameState;
        expect(state.floatingTexts).toHaveLength(1);
        expect(state.floatingTexts[0]).toMatchObject({
            x: circle.x,
            y: circle.y,
            text: `+${gainedScore}`,
        });
    });

    test('currentGameState reflects elapsed time in seconds', () => {
        const model = buildModel();
        model.start();

        now = 2000;
        model.update(now);

        const state = model.currentGameState;
        expect(state.secondsRemaining).toBe(
            Math.round((defaultGameSettings.game.gameDuration - now) / 1000)
        );
    });
});

describe('helpers', () => {
    test('updateFloatingTexts updates lifetime and filters dead texts', () => {
        const alive = new FloatingText(0, 0, '+1', 1, 10);
        const dead = new FloatingText(0, 0, '+2', 1, 0);

        const result = updateFloatingTexts({
            texts: [alive, dead],
            deltaTime: 5,
        });

        expect(alive.lifetime).toBe(5);
        expect(result).toEqual([alive]);
    });

    test('calculateAccuracyLevel rewards closer hits', () => {
        expect(
            calculateAccuracyLevel({
                circleCenterX: 0,
                circleCenterY: 0,
                hitX: 5,
                hitY: 0,
                totalLevels: 10,
                circleMaxRadius: 10,
            })
        ).toBe(5);
        expect(
            calculateAccuracyLevel({
                circleCenterX: 0,
                circleCenterY: 0,
                hitX: 0,
                hitY: 0,
                totalLevels: 10,
                circleMaxRadius: 10,
            })
        ).toBe(10);
    });

    test('calculateSpeedLevel rewards faster pops', () => {
        const fullLifecycle = 2000;
        const totalLevels = 5;

        expect(
            calculateSpeedLevel({
                circleLifetime: 400,
                totalTimeLevels: totalLevels,
                circleFullLifecycle: fullLifecycle,
            })
        ).toBe(4);
        expect(
            calculateSpeedLevel({
                circleLifetime: 1800,
                totalTimeLevels: totalLevels,
                circleFullLifecycle: fullLifecycle,
            })
        ).toBe(1);
    });

    test('calculateDistance returns euclidean distance', () => {
        expect(calculateDistance({ ax: 0, ay: 0, bx: 3, by: 4 })).toBe(5);
        expect(calculateDistance({ ax: -1, ay: -1, bx: -4, by: -5 })).toBe(5);
    });
});
