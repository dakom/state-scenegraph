import * as R from 'ramda';

import { NumberArray } from '../array/Array';
import { rgbFromColorIndex } from '../color/Color';
import { createMat4, matrixMultiply } from '../matrix/Matrix';
import {Transform} from "../transform/Transform";
import {
    createWebGlBufferSwitcher,
    createWebGlShaderSwitcher,
    makeFramebufferPicker,
    switchTexture,
    WebGlBufferSwitcher,
    WebGlFramebufferPicker,
    WebGlShaderSwitcher,
} from '../webgl/WebGl';

export type WebGlElement = Partial<{
    rendererId:string;
    interactive:boolean;
    clipSpace: Float32Array;
    transform:Transform;
    visible: boolean;
    
    //only used here if picker and interactive
    id:number; 
    hitColor: Float32Array;
}>

export const setWebGlElementClipSpace = (cameraMatrix:NumberArray) => (element:WebGlElement):WebGlElement => 
    ({
        ...element,
        clipSpace: Float32Array.from(matrixMultiply (cameraMatrix) (element.transform.worldSpace))
    })

export interface WebGlRendererConfig {
    elementRenderers: Map<string, WebGlElementRenderer>;
    canvasElement:HTMLCanvasElement;
    clearBits:number; //gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT
    clearColor:NumberArray;
    picker:boolean;
}

export type WebGlElementRenderer = (renderer:WebGlRenderer) => (item: WebGlElement) => void;

export interface WebGlRenderer {
    render: (elements:Array<WebGlElement>) => void;
    resize: ({ width, height }: { width: number, height: number }) => void;
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    shaders: WebGlShaderSwitcher;
    buffers: WebGlBufferSwitcher;
    getPicker: () => WebGlFramebufferPicker;
    colorHitMap: Map<number, number>;
    switchTexture: (texture: WebGLTexture) => (slot: number) => void;
    allocateId: () => number;
}

export const createWebGlRenderer = (config:WebGlRendererConfig): WebGlRenderer => {
    const canvas = config.canvasElement;
    //alpha false here only means the backbuffer. see https://webglfundamentals.org/webgl/lessons/webgl-and-alpha.html
    const gl = (canvas.getContext("webgl", { alpha: false }) as WebGLRenderingContext) || (canvas.getContext("experimental-webgl", { alpha: false }) as WebGLRenderingContext);
    const lastScreenSize = {
        width: NaN,
        height: NaN
    }

    const colorHitMap = new Map<number, number>();
    const shaders = createWebGlShaderSwitcher(gl);
    const buffers = createWebGlBufferSwitcher(gl);
    const worldIdentity = createMat4();
    const elementRenderers = new Map<string, (item: WebGlElement) => void>();

    let idGenerator = 1;
    let picker: WebGlFramebufferPicker; //gets reset on screen size


    const render = (elements:Array<WebGlElement>) => {
        //Clear the webgl buffers
        gl.clear(config.clearBits);
        if (config.picker && picker !== undefined) {
            picker.clear(config.clearBits);
        }

        //clear the hitmap
        colorHitMap.clear();
        let colorIndex = 0;

        const addRenderPropsToElement = (element: WebGlElement): WebGlElement => {
            const ret = Object.assign({}, element) as WebGlElement;

            if (config.picker && element.interactive) {
                colorIndex++;
                const color = rgbFromColorIndex(colorIndex);
                colorHitMap.set(colorIndex, element.id);
                ret.hitColor = Float32Array.from([color[0], color[1], color[2], 1.0]);
            }

            return ret;
        }

        //Flush the renderer with current state and additional prop mapper
        elements
            .filter(element => element.rendererId && element.visible && element.clipSpace)
            .map((element: WebGlElement): WebGlElement => {
                //Add hit color if relevant
                if (config.picker && element.interactive) {
                    colorIndex++;
                    const color = rgbFromColorIndex(colorIndex);
                    colorHitMap.set(colorIndex, element.id);
                    return Object.assign({}, element, {
                        hitColor: Float32Array.from([color[0], color[1], color[2], 1.0])
                    });
                }
                return element;
            })
            .forEach(element => elementRenderers.get(element.rendererId) (element));
    }

    const resize = ({ width, height }: { width: number, height: number }) => {

        if (lastScreenSize.width !== width || lastScreenSize.height !== height) {

            canvas.setAttribute('width', width.toString());
            canvas.setAttribute('height', height.toString());

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            if(config.picker) {
                if (picker !== undefined) {
                    picker.dispose();
                }
                picker = makeFramebufferPicker(gl)({ width: gl.drawingBufferWidth, height: gl.drawingBufferHeight });
            }

            lastScreenSize.width = width;
            lastScreenSize.height = height;
        }
    }

    //first-time initial gl setup
    gl.clearColor(config.clearColor[0], config.clearColor[1], config.clearColor[2], config.clearColor[3]);
    /*
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    */

    const renderer = {
        render: render,
        resize: resize,
        canvas: canvas,
        gl: gl,
        shaders: shaders,
        buffers: buffers,
        switchTexture: switchTexture(gl),
        colorHitMap: colorHitMap,
        getPicker: () => picker,
        allocateId: () => {
            idGenerator++;
            return idGenerator;
        }
    }

    config.elementRenderers.forEach((v,k) => elementRenderers.set(k, v(renderer)))
    return renderer;
}