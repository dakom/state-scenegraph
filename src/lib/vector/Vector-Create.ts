import {NumberArray} from "../array/Array";

const identity3:Readonly<Array<number>> = [0,0,0];
const identity4:Readonly<Array<number>> = [0,0,0,0];

export const createVec3 = (vals?:NumberArray):NumberArray =>
  Float64Array.from(vals === undefined ? identity3 : vals);

export const createVec4 = (vals?:NumberArray):NumberArray =>
  Float64Array.from(vals === undefined ? identity4 : vals);