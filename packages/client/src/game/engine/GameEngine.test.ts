import { defaultGameSettings } from '@store/slices/gameSlice';

import type { GameState } from '../model/gameModel';

import { GameEngine } from './GameEngine';

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 100;
const FRAME_TIME_MS = 16; // ~60fps frame spacing used by RAF timestamps

// shared DOMRect snapshot so scaling math stays same across tests
const MOCK_RECT = {
    left: 10,
    top: 20,
    width: 100,
    height: 50,
    right: 110,
    bottom: 70,
    x: 10,
    y: 20,
    toJSON: () => ({}),
} as DOMRect;

const createState = (overrides: Partial<GameState> = {}): GameState => ({
    circles: [],
    score: 0,
    secondsRemaining: 0,
    isRunning: true,
    isGameOver: false,
    floatingTexts: [],
    ...overrides,
});

const modelInstances: Array<ReturnType<typeof createModelStub>> = [];
const rendererInstances: Array<ReturnType<typeof createRendererStub>> = [];

function createModelStub() {
    const getState = jest.fn(() => createState());
    return {
        start: jest.fn(),
        update: jest.fn(),
        processClick: jest.fn(),
        getState,
        get currentGameState() {
            return getState();
        },
    };
}

function createRendererStub() {
    return {
        renderGame: jest.fn(),
    };
}

jest.mock('../model/gameModel', () => ({
    GameModel: jest.fn().mockImplementation(() => {
        const instance = createModelStub();
        modelInstances.push(instance);
        return instance;
    }),
}));

jest.mock('../view/gameRenderer', () => ({
    GameRenderer: jest.fn().mockImplementation(() => {
        const instance = createRendererStub();
        rendererInstances.push(instance);
        return instance;
    }),
}));

describe('GameEngine', () => {
    let canvas: HTMLCanvasElement;
    let requestAnimationFrameSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        // empties the array without making a new one
        modelInstances.length = 0;
        rendererInstances.length = 0;

        canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        jest.spyOn(canvas, 'getContext').mockReturnValue(
            {} as CanvasRenderingContext2D
        );
        canvas.getBoundingClientRect = jest.fn(() => MOCK_RECT);

        requestAnimationFrameSpy = jest
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((cb: FrameRequestCallback) => {
                cb(0);
                return 1;
            });
    });

    afterEach(() => {
        requestAnimationFrameSpy.mockRestore();
    });

    const buildEngine = () =>
        new GameEngine(canvas, jest.fn(), defaultGameSettings);

    test('start triggers model loop and renderer while game is running', () => {
        const engine = buildEngine();
        const model = modelInstances[0];
        const renderer = rendererInstances[0];

        model.getState
            .mockReturnValueOnce(createState({ isGameOver: false }))
            .mockReturnValueOnce(createState({ isGameOver: true }));

        const callbackQueue: FrameRequestCallback[] = [];
        requestAnimationFrameSpy.mockImplementation(
            (cb: FrameRequestCallback) => {
                callbackQueue.push(cb);
                return callbackQueue.length;
            }
        );

        engine.start();

        expect(model.start).toHaveBeenCalled();
        expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);

        // run first frame (renders)
        callbackQueue.shift()?.(0);
        expect(model.update).toHaveBeenCalledTimes(1);
        expect(model.update).toHaveBeenNthCalledWith(1, 0);
        expect(model.getState).toHaveBeenCalledTimes(1);
        expect(renderer.renderGame).toHaveBeenCalledWith(
            expect.objectContaining({ isGameOver: false })
        );

        // loop schedules another frame even though next state ends the game
        expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);
        callbackQueue.shift()?.(FRAME_TIME_MS);
        expect(model.update).toHaveBeenNthCalledWith(2, FRAME_TIME_MS);
        expect(model.getState).toHaveBeenCalledTimes(2);
        // does not render the game again - it is over
        expect(renderer.renderGame).toHaveBeenCalledTimes(1);
    });

    test('destroy stops the loop and removes the click handler', () => {
        const engine = buildEngine();
        const model = modelInstances[0];
        const clickEvent = new MouseEvent('click', {
            clientX: 60,
            clientY: 70,
        });

        canvas.dispatchEvent(clickEvent);
        expect(model.processClick).toHaveBeenCalledTimes(1);

        const removeSpy = jest.spyOn(canvas, 'removeEventListener');
        engine.destroy();
        expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));

        canvas.dispatchEvent(clickEvent);
        // processClick does not run again once listener is removed
        expect(model.processClick).toHaveBeenCalledTimes(1);
    });

    test('handleClick scales coordinates before delegating to the model', () => {
        // need in this test for attach click listener
        buildEngine();
        const model = modelInstances[0];

        const clientX = 60;
        const clientY = 70;

        const event = new MouseEvent('click', {
            clientX,
            clientY,
        });

        canvas.dispatchEvent(event);

        const expectedX =
            (clientX - MOCK_RECT.left) * (canvas.width / MOCK_RECT.width);
        const expectedY =
            (clientY - MOCK_RECT.top) * (canvas.height / MOCK_RECT.height);

        expect(model.processClick).toHaveBeenCalledWith(expectedX, expectedY);
    });
});
