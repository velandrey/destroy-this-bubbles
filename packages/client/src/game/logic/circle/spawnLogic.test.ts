import { defaultGameSettings, TGameSettings } from '@store/slices/gameSlice';
import Circle from 'game/objects/circle';

import { SpawnLogic } from './spawnLogic';

type PartialSettings = {
    circle?: Partial<TGameSettings['circle']>;
    spawn?: Partial<TGameSettings['spawn']>;
    game?: Partial<TGameSettings['game']>;
};

const createSettings = (overrides: PartialSettings = {}): TGameSettings => ({
    circle: { ...defaultGameSettings.circle, ...overrides.circle },
    spawn: { ...defaultGameSettings.spawn, ...overrides.spawn },
    game: { ...defaultGameSettings.game, ...overrides.game },
});

jest.mock('game/objects/circle');
const CircleMock = jest.mocked(Circle);

describe('SpawnLogic', () => {
    beforeEach(() => {
        CircleMock.mockReset();
    });

    const CANVAS_WIDTH = 200;
    const CANVAS_HEIGHT = 100;
    const INTERVAL_MS = 100;
    const MAX_CIRCLES = 1;

    test('update spawns circles after the interval while respecting maxCircles', () => {
        const settings = createSettings({
            spawn: {
                interval: INTERVAL_MS,
                maxCircles: MAX_CIRCLES,
            },
        });
        const logic = new SpawnLogic(CANVAS_WIDTH, CANVAS_HEIGHT, settings);
        const circles: Circle[] = [];

        const circleInstance = { id: 'circle-1' } as unknown as Circle;
        CircleMock.mockReturnValue(circleInstance);

        logic.update(INTERVAL_MS / 2, circles);
        expect(circles).toHaveLength(0);

        logic.update(INTERVAL_MS * 2, circles);
        expect(circles).toEqual([circleInstance]);
        expect(CircleMock).toHaveBeenCalledTimes(1);

        logic.update(INTERVAL_MS * 3, circles);
        expect(circles).toHaveLength(1);
        expect(CircleMock).toHaveBeenCalledTimes(1);
    });

    test('spawnCircle positions new circles within canvas bounds', () => {
        const MIN_RADIUS = 2;
        const MAX_RADIUS = 10;
        const COLOR = 'blue';
        const WIDTH = 300;
        const HEIGHT = 200;
        const RANDOM_X = 0.25;
        const RANDOM_Y = 0.75;
        const EXPECTED_X = RANDOM_X * (WIDTH - MAX_RADIUS * 2) + MAX_RADIUS;
        const EXPECTED_Y = RANDOM_Y * (HEIGHT - MAX_RADIUS * 2) + MAX_RADIUS;

        const settings = createSettings({
            circle: {
                minRadius: MIN_RADIUS,
                maxRadius: MAX_RADIUS,
                color: COLOR,
            },
        });

        const logic = new SpawnLogic(WIDTH, HEIGHT, settings);
        const circleInstance = { id: 'circle' } as unknown as Circle;
        CircleMock.mockReturnValue(circleInstance);

        const randomSpy = jest.spyOn(Math, 'random');
        randomSpy.mockReturnValueOnce(RANDOM_X).mockReturnValueOnce(RANDOM_Y);

        const spawned = logic.spawnCircle();

        expect(CircleMock).toHaveBeenCalledWith(
            EXPECTED_X,
            EXPECTED_Y,
            MIN_RADIUS,
            COLOR,
            settings.circle
        );
        expect(spawned).toBe(circleInstance);
        randomSpy.mockRestore();
    });
});
