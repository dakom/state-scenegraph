
import { mat4, vec3 } from 'gl-matrix';
import * as L from 'partial.lenses';
import * as R from 'ramda';

import { S } from '../../external/sanctuary/Sanctuary';
import {createMat4} from "../matrix/Matrix";
import {createQuat} from "../quat/Quat";
import {createVec3} from "../vector/Vector";

import {NumberArray} from "../array/Array";
import { matrixMultiply } from '../matrix/Matrix';
import {screenEventToWorldPoint, PointerScreenEventData} from "../input/Input";

export interface Transform {
    posX: number;
    posY: number;
    posZ: number;
    originX: number;
    originY: number;
    originZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    rotX: number;
    rotY: number;
    rotZ: number;
    rotW: number;
    localSpace: NumberArray;
    worldSpace?: NumberArray;
    parentWorldSpace?: NumberArray;
}

export const getTransformPosition = (t:Transform): NumberArray =>
  createVec3([t.posX, t.posY, t.posZ]);

export const getTransformOrigin = (t:Transform): NumberArray =>
  createVec3([t.originX, t.originY, t.originZ]);

export const getTransformScale = (t:Transform): NumberArray =>
  createVec3([t.scaleX, t.scaleY, t.scaleZ]);

export const getTransformRotation = (t:Transform): NumberArray =>
  createQuat([t.rotX, t.rotY, t.rotZ, t.rotW]);

export const setTransformPosition = (v:NumberArray) => (t:Transform): Transform =>
  Object.assign({}, t, {
    posX: v[0],
    posY: v[1],
    posZ: v[2]
  });

export const setTransformOrigin = (v:NumberArray) => (t:Transform): Transform =>
  Object.assign({}, t, {
    originX: v[0],
    originY: v[1],
    originZ: v[2]
  });

export const setTransformScale = (v:NumberArray) => (t:Transform): Transform =>
  Object.assign({}, t, {
    scaleX: v[0],
    scaleY: v[1],
    scaleZ: v[2]
  });

export const setTransformRotation = (v:NumberArray) => (t:Transform): Transform =>
  Object.assign({}, t, {
    rotX: v[0],
    rotY: v[1],
    rotZ: v[2],
    rotW: v[3]
  });

export const getTransformCenter = (t:Transform):NumberArray => 
  vec3.add(createVec3() as any, getTransformOrigin(t) as any, getTransformPosition(t) as any);

export const getVectorFromTransformCenters = (t1:Transform) => (t2:Transform) => 
  vec3.sub(createVec3() as any, getTransformCenter(t1) as any, getTransformCenter(t2) as any);

export const transformVectorSpace = (v: NumberArray) => (space:NumberArray): NumberArray =>
  vec3.transformMat4(createVec3() as any, v as any, space as any) as NumberArray;

export const transformVectorInvertedSpace = (v: NumberArray) => (space:NumberArray): NumberArray =>
  vec3.transformMat4(createVec3() as any, v as any, mat4.invert(createMat4() as any, space as any)) as any;


export const getTransformWorldPosition = (t:Transform):NumberArray =>
  transformVectorSpace (getTransformPosition(t)) (t.parentWorldSpace);

export const moveTransform = (evt: PointerScreenEventData) => (offset: NumberArray) => (t:Transform): Transform => {
    const pointerWorldPoint = screenEventToWorldPoint(evt)(evt);
    const offsetWorldPoint = vec3.add(createVec3() as any, pointerWorldPoint as any, offset as any);
    const localPoint = transformVectorInvertedSpace(offsetWorldPoint)(t.parentWorldSpace);
    return createWorldTransform({
          ...t,
          posX: localPoint[0],
          posY: localPoint[1]
    })
}

export const createLocalSpaceImpure = (target:NumberArray) => (t: Transform): NumberArray => {
  
  return mat4.fromRotationTranslationScaleOrigin(target as any,
    getTransformRotation(t) as any,
    getTransformPosition(t) as any,
    getTransformScale(t) as any,
    getTransformOrigin(t) as any) as any;
}
  
export const createLocalSpace =  (t: Transform): NumberArray =>
    createLocalSpaceImpure (createMat4()) (t);

const _identityProps:Readonly<any> = {
    posX: 0,
    posY: 0,
    posZ: 0,
    originX: 0,
    originY: 0,
    originZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    rotW: 1,
};

export const createLocalTransform = (_t?: Partial<Transform>): Transform => {
  if(_t === undefined) {
    return Object.assign({localSpace: createMat4()}, _identityProps) as Transform;
  }

  const t = Object.assign({}, _identityProps, _t) as Transform;
  t.localSpace = createLocalSpace(t);
  return t;
}

export const createWorldTransform = (_t?: Partial<Transform>): Transform => {
  const t = createLocalTransform(_t);

  if(!t.parentWorldSpace) {
    t.parentWorldSpace = createMat4();
  }
  t.worldSpace = matrixMultiply(t.parentWorldSpace) (t.localSpace);
  return t;
}

  
export const zeroPoint:Readonly<NumberArray> = [0.0, 0.0, 0.0];