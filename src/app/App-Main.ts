import {
    childLensPath,
    createVec3,
    getCameraOrthoFullscreen,
    getScreenSize,
    getStateTransformLocalParentPointToWorld,
    getStateTransformPosition,
    getStateTransformWorldPointToLocalParent,
    KeyboardEventData,
    KeyboardEventStatus,
    KeyboardSourceId,
    lPosX,
    lPosY,
    propsAtChildLensPath,
    makePointerCalmValidator,
    rgbToColorIndex,
    screenToWorldPoint,
    startKeyboard,
    startScreen,
    startTick,
    startPointer,
    StateElement,
    TickEventData,
    PointerEventData,
    PointerEventStatus,
    PointerSourceId,
    updateStateElementWorldTransforms,
    PROPS,
    logState
} from '../lib/Drift';
import { vec3 } from 'gl-matrix';
import * as L from 'partial.lenses';

import { DomEventData, startDom } from './dom/Dom';
import { createQuadRenderer } from './quad/Quad';
import { createRenderer } from './renderer/Renderer';
import { initialState } from './state/State';
import { S } from '../external/sanctuary/Sanctuary';

/*
    Config
*/

const SPEED = 300;

/*
    Renderer
*/

const renderer = createRenderer();
renderer.elementRenderers.set("quad", createQuadRenderer(renderer));
/*
    Lenses
*/

//State
const lFirstDraw = L.compose([PROPS, "firstDraw"]);

//Controller
const lController = propsAtChildLensPath([0]);
const lControllerX = L.compose(lController, "x");
const lControllerY = L.compose(lController, "y");
const lControllerOffsetX = L.compose(lController, "offsetX");
const lControllerOffsetY = L.compose(lController, "offsetY");
const lControllerIsDrag = L.compose(lController, "isDrag");
const lControllerType = L.compose(lController, "type");
const lControllerTarget = L.compose(lController, "target");

//Camera
const lCamera = propsAtChildLensPath([1]);
export const lCameraMatrix = L.compose([lCamera, "matrix"]); //exported for renderer

//Quads
const lQuads = childLensPath([1, 0]);

/*
    Keyboard Mappings
 */

const KeyboardMapping = {
    ArrowUp: L.set(lControllerY)(1),
    ArrowDown: L.set(lControllerY)(-1),
    ArrowLeft: L.set(lControllerX)(-1),
    ArrowRight: L.set(lControllerX)(1)
}
/*
    Event handlers
    All of them are essentially:

    EventData -> StateElement -> StateElement
*/

//Update the camera based on resize events
const onScreenResize = (screenSize: { width: number, height: number }) =>
    S.pipe([
        L.set(lCamera)(getCameraOrthoFullscreen(screenSize)),
    ]);

//Update the controller based on keyboard events
const onKeyboard = (evtData: KeyboardEventData) =>
    (evtData.status === KeyboardEventStatus.RELEASE)
        ? S.pipe([
            _state => (evtData.key === "ArrowLeft" || evtData.key === "ArrowRight")
                ? L.set(lControllerX)(0)(_state)
                : L.set(lControllerY)(0)(_state),
            S.when(_state => (L.get(lControllerX)(_state) === 0 && L.get(lControllerY)(_state) === 0))(
                S.pipe([
                    L.remove(lControllerType),
                    L.remove(lControllerTarget)
                ]))
        ])
        : S.pipe([
            L.set(lControllerType)(KeyboardSourceId),
            L.set(lControllerTarget)(L.compose([lQuads, childLensPath([0])])), //target the first, bottom-most quad
            L.get(evtData.key)(KeyboardMapping)
        ])

//Update the controller based on pointer events
//Will use the framebuffer/picker to get the lens for the target object
const getPointerWorldPoint = (state: StateElement) =>
    screenToWorldPoint(getScreenSize())(L.get(lCamera)(state));

const onPointer = (evtData: PointerEventData) =>
    (evtData.status === PointerEventStatus.END)
        ? S.pipe([
            L.set(lControllerX)(0),
            L.set(lControllerY)(0),
            L.remove(lControllerType),
            L.remove(lControllerTarget),
            L.remove(lControllerIsDrag)
        ])
        : (evtData.status === PointerEventStatus.START)
            ? state => {
                const picker = renderer.getPicker();

                if (picker !== undefined) {
                    const pixel = picker.readPixel(evtData as any);
                    const pixelIndex = rgbToColorIndex(pixel);

                    if (renderer.colorHitMap.has(pixelIndex)) {
                        const lTarget = childLensPath(renderer.colorHitMap.get(pixelIndex));
                        const element = L.get(lTarget)(state);
                        const worldPoint = getPointerWorldPoint(state)(evtData as any);

                        const localPos = getStateTransformPosition(element);
                        const positionWorld = getStateTransformLocalParentPointToWorld(localPos)(element);

                        const diff = vec3.subtract(createVec3() as any, positionWorld as any, worldPoint as any);


                        return S.pipe([
                            L.set(lControllerOffsetX)(diff[0]),
                            L.set(lControllerOffsetY)(diff[1]),
                            L.set(lControllerType)(PointerSourceId),
                            L.set(lControllerTarget)(lTarget),
                            L.remove(lControllerIsDrag)
                        ])
                            (state)
                    }

                }
                return state;
            }
            : S.when(state => L.get(lControllerType)(state) === PointerSourceId && evtData.status === PointerEventStatus.MOVE)(state => {

                //note - there is an optimization here that can be done by doing this just on pointerTickMove events
                const lTarget = L.get(lControllerTarget)(state);
                const offsetX = L.get(lControllerOffsetX)(state);
                const offsetY = L.get(lControllerOffsetY)(state);
                const worldPoint = getPointerWorldPoint(state)(evtData as any);
                const offsetWorldPoint = vec3.add(createVec3() as any, worldPoint as any, [offsetX, offsetY, 0]);

                const localPointerPoint = getStateTransformWorldPointToLocalParent(offsetWorldPoint as any)(L.get(lTarget)(state));

                return S.pipe([
                    L.set(lControllerX)(localPointerPoint[0]),
                    L.set(lControllerY)(localPointerPoint[1]),
                    L.set(lControllerIsDrag)(true)
                ])
                    (state);
            })

/*
    On tick - update the transforms (if the controller is activated)
*/

const shouldUpdateTransforms = (state: StateElement): boolean =>
    L.isDefined(lControllerTarget)(state)
    && (L.isDefined(lControllerIsDrag)(state) || L.get(lControllerType)(state) === KeyboardSourceId);

const onTick = (evtData: TickEventData) =>
    S.when(shouldUpdateTransforms)(_state => {
        const lTarget = L.get(lControllerTarget)(_state);

        const lPos = {
            x: L.compose([lTarget, lPosX]),
            y: L.compose([lTarget, lPosY]),
        }

        const currPos = {
            x: L.get(lPos.x)(_state),
            y: L.get(lPos.y)(_state)
        }

        const controller = {
            x: L.get(lControllerX)(_state),
            y: L.get(lControllerY)(_state)
        }

        return updateStateElementWorldTransforms(lTarget)((() => {
            switch (L.get(lControllerType)(_state)) {
                case KeyboardSourceId:
                    return S.pipe([
                        S.when(L.isDefined(lControllerX))
                            (L.set(lPos.x)(currPos.x + controller.x * SPEED * evtData.dt)),
                        S.when(L.isDefined(lControllerY))
                            (L.set(lPos.y)(currPos.y + controller.y * SPEED * evtData.dt)),
                    ])
                        (_state);

                case PointerSourceId:
                    return S.pipe([
                        L.set(lPos.x)(controller.x),
                        L.set(lPos.y)(controller.y)
                    ])
                        (_state)

                default: return _state;
            }
        })())
    })

/*
    Main
    The only thing it needs to do is setup the event listeners
    All the event listeners need to do is set the state based on the pipeline, and render (or resize)
*/

const Main = () => {
    console.log("DriftJS State / Scenegraph Example v0.0.4");

    let state = initialState;
    
    


    const onReady = (_state:StateElement) => {
        console.log("ready!");
        logState(state);
        console.log(state);
        
        startTick({})(evt => {
            state = onTick(evt.data) (state);
            renderer.render(state);
        });

        startKeyboard({})(evt => {
            state = L.isDefined(evt.data.key)(KeyboardMapping)
                ? onKeyboard(evt.data)(state)
                : state;
        });

        const basePointerOptions = {
            validate: makePointerCalmValidator(),
            domElement: document.getElementById("canvasTouch"),
            hasPointer: (window as any).PointerEvent ? true : false
        }

        const handlePointer = evt => {
            state = onPointer(evt.data)(state);
        };

        startPointer ({...basePointerOptions, status: PointerEventStatus.START }) (handlePointer)
        startPointer ({...basePointerOptions, status: PointerEventStatus.MOVE }) (handlePointer)
        startPointer ({...basePointerOptions, status: PointerEventStatus.END }) (handlePointer)
        startDom(evt => {
            const { lens, interactive } = (evt.data as DomEventData)
            state = L.set(lens)(interactive)(state);
        });

        return L.set(lFirstDraw) (false) (_state);
    }


    startScreen
        ({
            sendInitial: true, //immediately update the state via the resize pipeline (set camera etc.)
        })
        (evt => {
            state = S.pipe
                ([
                    onScreenResize(evt.data),
                    S.when(L.get(lFirstDraw)) (onReady),
                ])
                (state)

            renderer.resize(evt.data);
        });    
}

Main();