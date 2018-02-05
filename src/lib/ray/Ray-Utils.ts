import {NumberArray} from "../array/Array";
import {createVec3} from "../vector/Vector";
import { vec3 } from 'gl-matrix';

const DEFAULT_DISTANCE  = 4096;


export const getLineFromRay = ({origin, dir, dist}:{origin?: NumberArray, dir?: NumberArray, dist?: number}):[NumberArray, NumberArray] => {
    
    const scaleAmt = dist === undefined ? DEFAULT_DISTANCE : dist;

    const output = vec3.normalize(createVec3() as any, dir as any) as any;
    vec3.scale(output, output, scaleAmt);

    const p2 = vec3.add(output,origin as any,output) as any;

    return [origin, p2];
}
