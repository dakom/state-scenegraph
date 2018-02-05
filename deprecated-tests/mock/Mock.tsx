import { mat4, quat, vec3 } from "gl-matrix";
import {S} from "../../engine/utils/sanctuary/Sanctuary";

import { 
    ElementRenderer,
    KeyboardEventSerializer,
    WebGlShaderSource,  WebGlBufferData,
    IoConfig,
    StartDriftMain,
    Serializer,
    Serializers,
    RendererHook,
    registerKeyboard,
    CameraSerializer,
    registerScreen,
    registerTicker,
    TickerSerializer,
    ScreenSerializer,
    TickerSourceId,
    TouchSourceId,
    ScreenSourceId,
    KeyboardSourceId,
    InputEventSchedule
} from "../../engine/Exports";

//Renderers

export const renderers = new Map<string, ElementRenderer>();


//Shaders
const shaderSources = new Map<string, WebGlShaderSource>();
const shaderBuffers = new Map<string, WebGlBufferData>();

export const shaders = {
    sources: shaderSources,
    buffers: shaderBuffers
};

//Element props
export const propSerializers = new Map<string, Serializer>();

propSerializers.set('camera', CameraSerializer);

//Inputs
const inputSerializers = new Map<string, Serializer>();
inputSerializers.set(KeyboardSourceId, KeyboardEventSerializer);
inputSerializers.set(ScreenSourceId, ScreenSerializer);
inputSerializers.set(TickerSourceId, TickerSerializer);

//RendererHook
export const createRendererHook = (): RendererHook => {
    
    return (state) => {
        return {
            preRender: S.Nothing,
            renderState: S.Nothing,
            postRender: S.Nothing
        }
    }
}

//Input Sources
export const getInputSources = () => [
    registerScreen(),
    registerTicker(),
    registerKeyboard(),
];

export const createMock = (config:Partial<IoConfig>) =>
    StartDriftMain(Object.assign({
        unitTestMode: true,
        
        defaultInputEventSchedule: InputEventSchedule.NEXTFRAME,
        renderEventFirst: true,
        renderers: renderers,
        shaders: shaders,
        propSerializers: propSerializers,
        inputSerializers: inputSerializers,

        createRendererHook: createRendererHook,
        logMissingPropSerializers: false,

        getInputSources: getInputSources,

        stateUpdater: S.I,

        initialAppStateGenerator: () => null,
    }, config));