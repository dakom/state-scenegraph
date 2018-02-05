


import {
    createElement,

    appendElement,
    createTransform, SerializeTransformPropsToBinary, ParseTransformPropsFromBinary,
    createVec3, getLocalPosition, updateWorldTransformsInTree, lWorldSpace, lLocalSpace, lParentWorldSpace, lPosX, lPosY, lPosZ,
    impureUpdateWorldTransformsInTree,
    worldPointToLocal,
    worldPointToLocalParent
} from "../../../engine/Exports";

import { S } from "../../../engine/utils/sanctuary/Sanctuary";
import { createMat4, createQuat } from "../../../engine/utils/math/Math";

import * as L from "partial.lenses";
import { createMockState } from "../../mock/State-Mock";
import { mat4, quat, vec3 } from "gl-matrix";

test('BasicSerialize', () => {
    const t = createTransform({});
    t.worldSpace = createMat4();
    t.parentWorldSpace = createMat4();
    t.clipSpace = mat4.create();
    t.rot = createQuat();
    const binary = SerializeTransformPropsToBinary(t as any);
    const parsed = ParseTransformPropsFromBinary(binary);

    expect(parsed).toEqual(t);
})

const testUpdate = state => {
    const parent = state.children[1].children[0].children[1];
    const element = parent.children[0];

    const worldSpace = L.get(lWorldSpace)(element);
    const localSpace = L.get(lLocalSpace)(element);
    const elementParentWorldSpace = L.get(lParentWorldSpace)(element);
    const parentWorldSpace = L.get(lWorldSpace)(parent);
    const parentLocalSpace = L.get(lLocalSpace)(parent);


    expect(worldSpace[12]).toBe(42);
    expect(localSpace[12]).toBe(2);
    expect(parentWorldSpace[12]).toBe(40);
    expect(parentWorldSpace).toEqual(elementParentWorldSpace);


    expect
        (worldSpace)
        .toEqual(NumberArray.from([1,0,0,0,0,1,0,0,0,0,1,0,42,0,0,1]));


    expect
        (localSpace)
        .toEqual(NumberArray.from([1,0,0,0,0,1,0,0,0,0,1,0,2,0,0,1]));
}


test('Scene Hierarchy - pure', () => {
    testUpdate(updateWorldTransformsInTree(createMat4())(createMockState()));
});

test('Scene Hierarchy - impure', () => {
    const state = createMockState();
    impureUpdateWorldTransformsInTree(createMat4())(state);
    testUpdate(state);
});


test('Local point space conversion', () => {
    const state = updateWorldTransformsInTree(createMat4())(createMockState());

    const offset = NumberArray.from([-5,-1.2, 4]);

    const parent = state.children[1].children[0].children[1];
    const element = parent.children[0];

    const localPoint = worldPointToLocal (offset) (element);
    const localPointInParent = worldPointToLocalParent (offset) (element);

    expect(localPoint).toEqual(NumberArray.from([-47, -1.2, 4]));
    expect(localPointInParent).toEqual(NumberArray.from([-45, -1.2, 4]));

    expect(localPointInParent[0]).toEqual(
        offset[0] - L.get(lPosX)(parent)
    );
});