

import { 
    createElement, 
    appendElement,
    appLens,
    childLensPath,
    lPosX,
    lEventData,
    InputEvent,
    propsAtChildLensPath,
    KeyboardSourceId
} from "../../../engine/Exports";

import {S} from "../../../engine/utils/sanctuary/Sanctuary";
import * as L from "partial.lenses";
import {createMock} from "../../mock/Mock";
import {mockState, mockScene} from "../../mock/State-Mock";

test('State Machine - identity updates', () => {
    const io = createMock({
        initialAppStateGenerator: () => mockScene as any,
    })
    

    io.stateMachine.update({
        sourceId: KeyboardSourceId,
        data: {
            key: "a"
        }
    });

    io.stateMachine.update({
        sourceId: KeyboardSourceId,
        data: {
            key: "a"
        }
    });

    const state = io.stateMachine.getState();
    
    const lOutput = L.compose([
        childLensPath ([1,1]) ,
        lPosX
    ]);
        

    expect(L.get(lOutput) (mockState))
        .toEqual(L.get(lOutput) (state));

});

test('State Machine - actual updates', () => {
    const  lOutput = L.compose([
        appLens,
        childLensPath ([0,1]) ,
        lPosX
    ])

    const io = createMock({
        stateUpdater: state => {

            const amt = parseInt(L.get("key") (L.get(lEventData)(state)))

            const prev = L.get(lOutput) (state);
            
            return L.set(lOutput) (prev+amt) (state);
        },
        initialAppStateGenerator: () => mockScene as any,
    })

    io.stateMachine.update({
        sourceId: KeyboardSourceId,
        data: {
            key: "1"
        }
    });

    
    io.stateMachine.update({
        sourceId: KeyboardSourceId,
        data: {
            key: "3"
        }
    });

    io.stateMachine.update({
        sourceId: KeyboardSourceId,
        data: {
            key: "-2"
        }
    });
    

    const renderState = io.stateMachine.getState();
   
    //State should be the result of (1+3)-2, i.e. +2
    expect(L.get(lOutput) (renderState))
        .toEqual(L.get(lOutput) (mockState) + 2);
});