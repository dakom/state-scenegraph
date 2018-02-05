
import { 
    createElement, 
    findLensFrom,
    appendElement,
    childLensPath,
    propLens,
    lensPath
} from "../../../engine/Exports";

import {S} from "../../../engine/utils/sanctuary/Sanctuary";
import {createMockHierarchy} from "../../mock/State-Mock";
import * as L from "partial.lenses";

test('Child as numbers', () => {

    const seq = L.compose(
        childLensPath([1,0]),
        propLens("n"));

    expect(L.get (seq) (createMockHierarchy())).toBe("4");
});

test('Child as string', () => {
    const seq = L.compose(
        childLensPath([1,0]),
        propLens("n"));
    
    expect(L.get (seq) (createMockHierarchy())).toBe("4");
});

test('Child with type', () => {
    
    const seq = L.compose(
        lensPath(['_c',1]) (createMockHierarchy()),
        propLens("n"));
    
    expect(L.get (seq) (createMockHierarchy())).toBe("5");
});