import Circle from 'game/objects/circle';

import { checkHit } from './hitLogic';

const createCircleStub = () => {
    const containsPoint = jest.fn();
    const pop = jest.fn();
    return {
        containsPoint,
        pop,
    };
};

describe('checkHit', () => {
    test('returns miss when no circle contains the point', () => {
        const circleA = createCircleStub();
        const circleB = createCircleStub();

        circleA.containsPoint.mockReturnValue(false);
        circleB.containsPoint.mockReturnValue(false);

        const result = checkHit(
            [circleA as unknown as Circle, circleB as unknown as Circle],
            10,
            20
        );

        expect(result).toEqual({ hit: false });
        expect(circleA.containsPoint).toHaveBeenCalledWith(10, 20);
        expect(circleB.containsPoint).toHaveBeenCalledWith(10, 20);
        expect(circleA.pop).not.toHaveBeenCalled();
        expect(circleB.pop).not.toHaveBeenCalled();
    });

    test('returns hit and pops the first circle that contains the point', () => {
        const circleA = createCircleStub();
        const circleB = createCircleStub();
        const circleC = createCircleStub();

        circleA.containsPoint.mockReturnValue(false);
        circleB.containsPoint.mockReturnValue(true);

        const result = checkHit(
            [
                circleA as unknown as Circle,
                circleB as unknown as Circle,
                circleC as unknown as Circle,
            ],
            5,
            5
        );

        expect(result.hit).toBe(true);
        expect(result.circle).toBe(circleB);
        expect(circleA.containsPoint).toHaveBeenCalledWith(5, 5);
        expect(circleB.containsPoint).toHaveBeenCalledWith(5, 5);
        expect(circleC.containsPoint).not.toHaveBeenCalled();
        expect(circleA.pop).not.toHaveBeenCalled();
        expect(circleB.pop).toHaveBeenCalledTimes(1);
        expect(circleC.pop).not.toHaveBeenCalled();
    });
});
