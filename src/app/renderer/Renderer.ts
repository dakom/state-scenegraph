import {
    StateElement,
    stateElementForEachWithPath,
    createWebGlShaderSwitcher,
    createWebGlBufferSwitcher,
    makeFramebufferPicker,
    WebGlShaderSwitcher,
    WebGlBufferSwitcher,
    WebGlFramebufferPicker,
    getScreenSize,
    rgbFromColorIndex,
    PROPS
} from "../../lib/Drift";

import * as L from "partial.lenses";

export interface Renderer {
    elementRenderers: Map<string, (el: StateElement) => void>;
    render: (state: StateElement) => StateElement;
    resize: ({ width, height }: { width: number, height: number }) => void;
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    shaders: WebGlShaderSwitcher;
    buffers: WebGlBufferSwitcher;
    getPicker: () => WebGlFramebufferPicker;
    colorHitMap: Map<number, Array<number>>;
}

const lHitColor = L.compose([PROPS, "hitColor"]);
const lInteractive = L.compose([PROPS, "interactive"]);

export const createRenderer = (): Renderer => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const gl = (canvas.getContext("webgl") as WebGLRenderingContext) || (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
    const lastScreenSize = {
        width: NaN,
        height: NaN
    }

    const elementRenderers = new Map<string, (state:StateElement) => (el: StateElement) => void>();
    const shaders = createWebGlShaderSwitcher(gl);
    const buffers = createWebGlBufferSwitcher(gl);
    const colorHitMap = new Map<number, Array<number>>();

    let picker: WebGlFramebufferPicker; //gets reset on screen size

    const render = (state: StateElement): StateElement => {
        //Clear the webgl buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (picker !== undefined) {
            picker.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        colorHitMap.clear();        
        let colorIndex = 0;

        //Call the renderer for each element in the tree (if one is set)
        stateElementForEachWithPath(([el, cPath]) => {
            if (elementRenderers.has(el.type)) {
                const elementRenderer = elementRenderers.get(el.type) (state);

                if(L.get(lInteractive) (el)) {
                    colorIndex++;
                    const color = rgbFromColorIndex(colorIndex);
                    colorHitMap.set(colorIndex, cPath);
                    elementRenderer( 
                        L.set(lHitColor) (Float32Array.from([color[0], color[1], color[2], 1.0])) (el)
                    )
                } else {
                    elementRenderer(el);
                }
            }
        })
        (state);

        return state;
    }

    const resize = ({ width, height }: { width: number, height: number }) => {

        if (lastScreenSize.width !== width || lastScreenSize.height !== height) {
            canvas.setAttribute('width', width.toString());
            canvas.setAttribute('height', height.toString());

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            if (picker !== undefined) {
                picker.dispose();
            }
            picker = makeFramebufferPicker(gl)({ width: gl.drawingBufferWidth, height: gl.drawingBufferHeight });

            lastScreenSize.width = width;
            lastScreenSize.height = height;
        }
    }

    gl.clearColor(0, 0, 0, 0);

    return {
        elementRenderers: elementRenderers,
        render: render,
        resize: resize,
        canvas: canvas,
        gl: gl,
        shaders: shaders,
        buffers: buffers,
        colorHitMap: colorHitMap,
        getPicker: () => picker
    }

}



