import * as L from "partial.lenses";
import { PROPS, CHILDREN } from "./State-Accessors";
import { StateElement, StateElementLens } from "./State-Elements";
import { NumberArray } from "../array/Array";
import { createMat4 } from "../matrix/Matrix";

import {
  transformVectorSpace,
  getTransformPosition,
  getTransformScale,
  getTransformRotation,
  getTransformOrigin,
  transformVectorInvertedSpace,
  zeroPoint,
  createLocalSpace,
  createLocalSpaceImpure,
  Transform,
  createLocalTransform
} from "../transform/Transform";
import { mat4, quat } from "gl-matrix";

import * as R from "ramda";
import { S } from "../../external/sanctuary/Sanctuary";

//on the element itself
export const lTransform = L.compose([PROPS, "transform"]);

//these are on the transform props object
export const lLocalSpace = L.compose([lTransform, "localSpace"]);
export const lWorldSpace = L.compose([lTransform, "worldSpace"]);
export const lParentWorldSpace = L.compose([lTransform, "parentWorldSpace"]);
export const lPosX = L.compose([lTransform, "posX"]);
export const lPosY = L.compose([lTransform, "posY"]);
export const lPosZ = L.compose([lTransform, "posZ"]);

export const lOriginX = L.compose([lTransform, "originX"]);
export const lOriginY = L.compose([lTransform, "originY"]);
export const lOriginZ = L.compose([lTransform, "originZ"]);

export const lScaleX = L.compose([lTransform, "scaleX"]);
export const lScaleY = L.compose([lTransform, "scaleY"]);
export const lScaleZ = L.compose([lTransform, "scaleZ"]);

export const lRotX = L.compose([lTransform, "rotX"]);
export const lRotY = L.compose([lTransform, "rotY"]);
export const lRotZ = L.compose([lTransform, "rotZ"]);
export const lRotW = L.compose([lTransform, "rotW"]);


export const getStateTransformPosition = (el: StateElement): NumberArray =>
  getTransformPosition(L.get(lTransform)(el));

export const getStateTransformOrigin = (el: StateElement): NumberArray =>
  getTransformOrigin(L.get(lTransform)(el));

export const getStateTransformScale = (el: StateElement): NumberArray =>
  getTransformScale(L.get(lTransform)(el));

export const getStateTransformRotation = (el: StateElement): NumberArray =>
  getTransformRotation(L.get(lTransform)(el));


export const getStateTransformLocalPointToWorld = (v: NumberArray) => (el: StateElement): NumberArray =>
  transformVectorSpace(v)(L.get(lWorldSpace)(el));

export const getStateTransformLocalParentPointToWorld = (v: NumberArray) => (el: StateElement): NumberArray =>
  transformVectorSpace(v)(L.get(lParentWorldSpace)(el));

export const getStateTransformWorldPointToLocal = (v: NumberArray) => (el: StateElement): NumberArray =>
  transformVectorInvertedSpace(v)(L.get(lWorldSpace)(el));

export const getStateTransformWorldPointToLocalParent = (v: NumberArray) => (el: StateElement): NumberArray =>
  transformVectorInvertedSpace(v)(L.get(lParentWorldSpace)(el));

export const getStateTransformPositionInWorldFromElement = (el: StateElement) =>
  getStateTransformLocalPointToWorld(zeroPoint as NumberArray)(el);

export const getStateCenterPositionInWorldElement = (el: StateElement) =>
  getStateTransformLocalPointToWorld(getStateTransformOrigin(el))(el);

export const updateStateWorldTransforms = (subState: StateElement): StateElement => {
  const _update = (parentWorldSpace: NumberArray) => (lens: StateElementLens) => (elTree: StateElement) => {

    if (L.isDefined(L.compose([lens, lTransform]))(elTree)) {

      const localSpace = L.get(L.compose([lens, lLocalSpace]))(elTree);
      const worldSpace = mat4.multiply(createMat4() as any, parentWorldSpace as any, localSpace as any) as any;

      elTree = S.pipe([
        L.set(L.compose([lens, lWorldSpace]))(worldSpace),
        L.set(L.compose([lens, lParentWorldSpace]))(parentWorldSpace),
      ])(elTree);

      parentWorldSpace = worldSpace as any;
    }

    const children = L.get(L.compose([lens, CHILDREN]))(elTree);

    if (!R.isNil(children)) {
      if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          elTree = _update(parentWorldSpace)(lens.concat([CHILDREN, i]))(elTree)
        }
      } else {
        elTree = _update(parentWorldSpace)(lens.concat([CHILDREN]))(elTree)
      }
    }

    return elTree;
  }

  const initialParentWorldSpace =
    L.isDefined(lParentWorldSpace)(subState)
      ? L.get(lParentWorldSpace)(subState)
      : createMat4()

  return _update(initialParentWorldSpace)([])(subState);
}



export const updateStateElementWorldTransforms = elementLens =>
  S.pipe([
    _state =>
      L.set
        (L.compose([elementLens, lLocalSpace]))
        (createLocalSpace
          (L.get(L.compose([elementLens, lTransform]))(_state))
        )
        (_state),
    _state =>
      L.set
        (elementLens)
        (updateStateWorldTransforms(L.get(elementLens)(_state)))
        (_state)
  ]);

export const getStateElementClipSpaceImpure = (target: NumberArray) => (cameraMatrix: NumberArray) => (el: StateElement) =>
  mat4.multiply(target as any, cameraMatrix as any, L.get(lWorldSpace)(el));

export const getStateElementClipSpace = (cameraMatrix: NumberArray) => (el: StateElement) =>
  mat4.multiply(createMat4() as any, cameraMatrix as any, L.get(lWorldSpace)(el));

//faster - but impure
export const impureUpdateStateWorldTransforms = (subState: StateElement) => {
  const _update = (parentWorldSpace: NumberArray) => (lens: StateElementLens) => (elTree: StateElement) => {

    if (L.isDefined(L.compose([lens, lTransform]))(elTree)) {
      const _localSpace = L.get(L.compose([lens, lLocalSpace]))(elTree);
      const _worldSpace = L.get(L.compose([lens, lWorldSpace]))(elTree);
      const _parentWorldSpace = L.get(L.compose([lens, lParentWorldSpace]))(elTree);

      mat4.multiply(_worldSpace, parentWorldSpace as any, _localSpace as any) as any;
      mat4.copy(_parentWorldSpace, parentWorldSpace as any);
      parentWorldSpace = _worldSpace as any;
    }

    const children = L.get(L.compose([lens, CHILDREN]))(elTree);

    if (!R.isNil(children)) {
      if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          _update(parentWorldSpace)(lens.concat([CHILDREN, i]))(elTree)
        }
      } else {
        _update(parentWorldSpace)(lens.concat([CHILDREN]))(elTree)
      }
    }

  }
}

export const impureUpdateStateElementWorldTransforms = elementLens => (state: StateElement): StateElement => {
  const transformProps = L.get(L.compose([elementLens, lTransform]))(state);

  createLocalSpaceImpure(transformProps.localSpace)(transformProps);

  impureUpdateStateWorldTransforms(L.get(elementLens)(state));

  return state;
}

