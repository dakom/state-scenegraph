import {NumberArray} from "../array/Array";
import {mat4} from "gl-matrix";
import {createMat4} from "./Matrix-Create";

export const matrixMultiplyImpure = (out:NumberArray) => (dest:NumberArray) => (src:NumberArray) =>
  mat4.multiply(out as any, dest as any, src as any);

export const matrixMultiply = (dest:NumberArray) => (src:NumberArray) =>
  mat4.multiply(createMat4() as any, dest as any, src as any);