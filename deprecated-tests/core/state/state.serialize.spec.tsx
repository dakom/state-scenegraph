import {
    createElement,
    createTransform,
    appendElement,
    serializeStateToBinary,
    parseStateFromBinary,
    updateWorldTransformsInTree,
    createMat4,
    KeyboardEventStatus,
    KeyboardSourceId,
    InputEventSchedule
} from "../../../engine/Exports";

import { S } from "../../../engine/utils/sanctuary/Sanctuary";
import * as L from 'partial.lenses';
import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { createMock } from "../../mock/Mock";

const testRoundtrip = appState => {

    const ioEvent = {
        sourceId: KeyboardSourceId,
        data: {
            key: "1",
            status: KeyboardEventStatus.RELEASE
        },
        schedule: InputEventSchedule.IMMEDIATE,
        ts: 42
    }

    const io = createMock({
        initialAppStateGenerator: () => appState,
    });

    
    io.input.send(ioEvent);

    const state = io.stateMachine.getState();

    const binary = io.stateMachine.serialize(state);
    const parsed = io.stateMachine.parse(binary);

    expect(parsed).toEqual(state);
    expect(parsed.children[0].props.event).toEqual(ioEvent);
    expect(parsed.children[1]).toEqual(appState);
}


test('Serialize Single Element - Scene (empty)', () => {
    testRoundtrip(<scene><foo /></scene>);
});

test('Serialize Camera', () => {
    testRoundtrip(
        updateWorldTransformsInTree
            (createMat4())
            (
                <camera
                    projection={createMat4()}
                    eye={createMat4()}
                    matrix={createMat4()}
                />
            )
    );
});

test('Serialize Containers', () => {
    testRoundtrip(
        updateWorldTransformsInTree
            (createMat4())
            (
                <cameras>
                    <camera
                    projection={createMat4()}
                    eye={createMat4()}
                    matrix={createMat4()}
                    >
                        <camera
                            projection={createMat4()}
                            eye={createMat4()}
                            matrix={createMat4()}
                        />
                    </camera>

                    <camera
                    projection={createMat4()}
                    eye={createMat4()}
                    matrix={createMat4()}
                    >
                        <camera
                            projection={createMat4()}
                            eye={createMat4()}
                            matrix={createMat4()}
                        />
                    </camera>
                </cameras>
            )
    );

    

});


test('Serialize - Dom style', () => {
    testRoundtrip(<scene><div>Hello World</div></scene>);
});

