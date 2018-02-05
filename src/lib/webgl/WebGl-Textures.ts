import { Either, Maybe, S } from '../../external/sanctuary/Sanctuary';
import { isPowerOf2 } from '../math/Math';

export interface WebGlTextureOptions {
    gl:WebGLRenderingContext;
    alpha?: boolean;
    useMips?: boolean; 
    noFlip?:boolean;
}

export const createSimpleTextureFromTarget = (opts:WebGlTextureOptions) => (target: HTMLImageElement | HTMLCanvasElement): WebGLTexture => {
    const {gl} = opts;
    const format = opts.alpha ? gl.RGBA : gl.RGB;
    const texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if(opts.noFlip !== true) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    

    //https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
    if (isPowerOf2(target.width) && isPowerOf2(target.height) && opts.useMips === true) {
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, target);
    return texture;
}

export const switchTexture = (gl:WebGLRenderingContext) => (texture:WebGLTexture) => (slot:number) => {
    gl.activeTexture(slot);
    gl.bindTexture(gl.TEXTURE_2D, texture);
}