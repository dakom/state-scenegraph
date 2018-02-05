import {NumberArray} from "../array/Array";

const identity:Readonly<Array<number>> = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];

export const createMat4 = (vals?:NumberArray):NumberArray =>
  Float64Array.from(vals === undefined ? identity : vals);