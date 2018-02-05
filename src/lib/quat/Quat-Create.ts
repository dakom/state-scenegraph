import {NumberArray} from "../array/Array";

const identity:Readonly<Array<number>> = [0,0,0,1];

export const createQuat = (vals?:NumberArray):NumberArray =>
  Float64Array.from(vals === undefined ? identity : vals);