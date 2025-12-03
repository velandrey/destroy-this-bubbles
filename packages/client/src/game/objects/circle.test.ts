import { defaultGameSettings } from '@store/slices/gameSlice';

import Circle from './circle';

const circleConfig = defaultGameSettings.circle;

describe('Circle.containsPoint', () => {
    const centerX = 100;
    const centerY = 50;
    const radius = 10;

    const buildCircle = () =>
        new Circle(centerX, centerY, radius, circleConfig.color, circleConfig);

    test('returns true for points inside the radius', () => {
        const circle = buildCircle();

        expect(circle.containsPoint(centerX + radius / 2, centerY)).toBe(true);
        expect(circle.containsPoint(centerX, centerY - radius / 3)).toBe(true);
    });

    test('returns true for points on the boundary', () => {
        const circle = buildCircle();

        expect(circle.containsPoint(centerX + radius, centerY)).toBe(true);
    });

    test('returns false for points outside the radius', () => {
        const circle = buildCircle();

        expect(circle.containsPoint(centerX + radius + 0.01, centerY)).toBe(
            false
        );
        expect(circle.containsPoint(centerX, centerY + radius + 5)).toBe(false);
    });
});
