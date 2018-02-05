
import { 
    createElement, 
    findLensFrom,
    appendElement,
    childLensPath,
    propLens,
    lensPath,
    PROPS,
    CHILDREN
} from "../../../engine/Exports";

import {S} from "../../../engine/utils/sanctuary/Sanctuary";
import {createMockHierarchy} from "../../mock/State-Mock";
import * as L from "partial.lenses";

test('Single', () => {

    expect(<ball foo="bar" />).toEqual({
        type: "ball",
        props: {
            foo: "bar"
        },
        children: null,
        isChildText: false

    });
});



test('Deeper', () => {
    expect(createMockHierarchy()).toEqual(
        {
            type: "_a",
            props: { n: '1', d: { x: 'a' } },
            children:
            [
                { 
                    type: "_b", 
                    props: { n: '2', d: { x: "b" } }, 
                    children: null,
                    isChildText: false
                }, 
                
                {   type: "_c",
                    props: { n: '3', d: { x: "c", "0": "c2"} }, 
                    children: 
                    [
                        {
                            type: "_d",
                            props: { n: '4', d: { x: "d" } }, 
                            children: null,
                            isChildText: false
                        },
                        {
                            type: "_e",
                            props: { n: '5', d: { x: "e" } }, 
                            children: null,
                            isChildText: false
                        }
                    ],
                    isChildText: false
                },
                {   
                    type: "_f",
                    props: { n: '6', d: { x: "f" } }, 
                    children: 
                    [
                        {
                            type: "_g",
                            props: { n: '7', d: { x: "g" } }, 
                            children: null,
                            isChildText: false
                        }
                    ],
                    isChildText: false
                }
            ],
            isChildText: false
        }
    );
});

test('Insert change - Direct Value', () => {
    const nodeLens = lensPath(["_c"]) (createMockHierarchy() as any);
    const nodePropsLens = L.compose([nodeLens, PROPS]);
    const targetLens = L.compose([nodeLens,propLens("n")]);
    const updated = L.set(targetLens) (4) (createMockHierarchy());
   
    expect
        (L.get (nodePropsLens) (updated))
        .toEqual({ n: 4, d: { x: "c", "0": "c2"}}); 
});

test('Insert change - Merge', () => {
    const nodeLens = lensPath(["_c"]) (createMockHierarchy() as any);
    const nodePropsLens = L.compose([nodeLens, PROPS]);
    const updated = L.assign (nodePropsLens) ({n: 4}) (createMockHierarchy());
   
    expect
        (L.get (nodePropsLens) (updated))
        .toEqual({ n: 4, d: { x: "c", "0": "c2"}}); 
});

test('remove one node', () => {
    const nodeLens = lensPath(["_b"]) (createMockHierarchy() as any);
    const updated = L.remove (nodeLens) (createMockHierarchy() as any);

    expect(updated).toEqual(
        {
            type: "_a",
            props: { n: '1', d: { x: 'a' } },
            children:
            [   
                {   type: "_c",
                    props: { n: '3', d: { x: "c", "0": "c2"} }, 
                    children: 
                    [
                        {
                            type: "_d",
                            props: { n: '4', d: { x: "d" } }, 
                            children: null,
                            isChildText: false
                        },
                        {
                            type: "_e",
                            props: { n: '5', d: { x: "e" } }, 
                            children: null,
                            isChildText: false
                        }
                    ],
                    isChildText: false
                },
                {   
                    type: "_f",
                    props: { n: '6', d: { x: "f" } }, 
                    children: 
                    [
                        {
                            type: "_g",
                            props: { n: '7', d: { x: "g" } }, 
                            children: null,
                            isChildText: false
                        }
                    ],
                    isChildText: false
                }
            ],
            isChildText: false
        }
    );
});

test('remove node till single', () => {
    const nodeLens = lensPath(["_b"]) (createMockHierarchy() as any);
    const updated = L.remove (nodeLens) (createMockHierarchy());
    const nodeLens2 = lensPath(["_c"]) (updated);
    const updated2 = L.remove (nodeLens2) (updated);

    expect(updated2).toEqual(
        {
            type: "_a",
            props: { n: '1', d: { x: 'a' } },
            children:
            [   
                {   
                    type: "_f",
                    props: { n: '6', d: { x: "f" } }, 
                    children: 
                    [
                        {
                            type: "_g",
                            props: { n: '7', d: { x: "g" } }, 
                            children: null,
                            isChildText: false
                        }
                    ],
                    isChildText: false
                }
            ],
            isChildText: false
        }
    );
});

test('append node', () => {
    const parentLens = lensPath(["_a"]) (createMockHierarchy() as any);
    
    const updated = appendElement (parentLens) (<_h n="8" d={{ x: "h" }} />) (createMockHierarchy() as any);

    
    expect(updated).toEqual(
        {
            type: "_a",
            props: { n: '1', d: { x: 'a' } },
            children:
            [
                { 
                    type: "_b", 
                    props: { n: '2', d: { x: "b" } }, 
                    children: null,
                    isChildText: false
                }, 
                
                {   type: "_c",
                    props: { n: '3', d: { x: "c", "0": "c2"} }, 
                    children: 
                    [
                        {
                            type: "_d",
                            props: { n: '4', d: { x: "d" } }, 
                            children: null,
                            isChildText: false
                        },
                        {
                            type: "_e",
                            props: { n: '5', d: { x: "e" } }, 
                            children: null,
                            isChildText: false
                        }
                    ],
                    isChildText: false
                },
                {   
                    type: "_f",
                    props: { n: '6', d: { x: "f" } }, 
                    children: 
                    [
                        {
                            type: "_g",
                            props: { n: '7', d: { x: "g" } }, 
                            children: null,
                            isChildText: false
                        }
                    ],
                    isChildText: false
                },
                { 
                    type: "_h", 
                    props: { n: '8', d: { x: "h" } }, 
                    children: null,
                    isChildText: false
                },
            ],
            isChildText: false
        }
    );
});

