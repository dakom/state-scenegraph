import { vec3 } from 'gl-matrix';

import { getPointsFromRay } from '../../../engine/Exports';

test('Ray', () => {
    const targetDistance = 42;

    const [p1, p2] = getLineFromRay({
        origin: NumberArray.from([0, -.4, 7]),
        dir: NumberArray.from([-4.2, 8.2, -3]),
        dist: targetDistance
    });

    const distance = vec3.distance(p1 as any, p2 as any);

    expect(Math.round(distance)).toBe(targetDistance);
});