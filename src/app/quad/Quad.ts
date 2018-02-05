import {WebGlConstants, WebGlBufferActivateOptions, WebGlBufferData, StateElement, lWorldSpace, WebGlShaderSwitcher, WebGlBufferSwitcher, getStateElementClipSpaceImpure} from '../../lib/Drift';
import {Renderer} from "../renderer/Renderer";
import {mat4} from "gl-matrix";
import {lCameraMatrix} from "../App-Main";

import * as L from "partial.lenses";

const vertexShader = `
    attribute vec4 a_Vertex;
    uniform mat4 u_Transform;
    uniform mat4 u_Size;
    
    void main() {     
        gl_Position = u_Transform * (u_Size * a_Vertex);
    }
`;

const fragmentShader = `
    precision mediump float;
    uniform vec4 u_Color;

    void main() {
        gl_FragColor = u_Color;
    }
`;

const SHADER_ID = "quad";
const BUFFER_ID = "quad";

export const createQuadRenderer = (renderer:Renderer) => {
    const {gl, shaders, buffers, getPicker} = renderer;

    shaders.createShader(SHADER_ID)({
        vertex: vertexShader,
        fragment: fragmentShader
    });

    shaders.switchShaderProgram(SHADER_ID);

    const attrib = shaders.getAttributeLocation(SHADER_ID);
    const uniform = shaders.getUniformLocation(SHADER_ID);

    const uSize = uniform("u_Size");
    const uTransform = uniform("u_Transform");
    const uColor = uniform("u_Color");

    const emptyPixel = Float32Array.from([0.0, 0.0, 0.0, 0.0]);
    const sizeMatrix = mat4.create();
    const transformMatrix = mat4.create();

    const setClipSpace = getStateElementClipSpaceImpure(transformMatrix);

    buffers.assignBuffer(BUFFER_ID) ({
        target: WebGlConstants.ARRAY_BUFFER,
        usagePattern: WebGlConstants.STATIC_DRAW,
        data: new Float32Array([
            0.0,1.0, // top-left
            0.0,0.0, //bottom-left
            1.0, 1.0, // top-right
            1.0, 0.0 // bottom-right
        ])
    });

    const bVertex: WebGlBufferActivateOptions = {
        index: attrib("a_Vertex"),
        size: 2,
        type: gl.FLOAT
    };

    return (state:StateElement) => (el:StateElement) => {
        const {width, height, hitColor, color} = el.props;
        
        //console.log(hitColor);

        shaders.switchShaderProgram(SHADER_ID);
        
        //render data
        mat4.fromScaling(sizeMatrix, [width, height, 1]);
        setClipSpace(L.get(lCameraMatrix) (state)) (el);
        
        //set uniform/attributes (color is set below based on interactive settings)

        gl.uniformMatrix4fv(uSize, false, sizeMatrix);
        gl.uniformMatrix4fv(uTransform, false, transformMatrix);

        buffers.activateBuffer(BUFFER_ID) (bVertex);

        
        //for picker
        const picker = getPicker();
        if (hitColor !== undefined && picker !== undefined) {
            picker.bind();
            gl.uniform4fv(uColor, hitColor); //the colored quad just uses it for both
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            picker.unbind();
        }

        gl.uniform4fv(uColor,Float32Array.from(color));

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}