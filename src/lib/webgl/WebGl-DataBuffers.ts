
export type VertexData = ArrayBuffer | ArrayBufferLike | ArrayBufferView;

export interface WebGlBufferSwitcher {
    nextId: () => string;
    assignBuffer: (id:string) => (data:WebGlBufferData) => WebGLBuffer;
    switchBuffer: (bufferId:string) => WebGLBuffer;
    activateBuffer: (id:string) => (opts: WebGlBufferActivateOptions) => WebGLBuffer;
}

export interface WebGlBufferActivateOptions {
    index:GLuint;
    size:GLint;
    type:GLenum;
    normalized?:GLboolean;
    stride?:GLsizei;
    offset?:GLintptr;
}

export interface WebGlBufferData {
    target: GLenum,
    usagePattern: GLenum,
    data: VertexData,
}

interface BufferInfo extends WebGlBufferData{
    buffer: WebGLBuffer
};


export const createWebGlBufferSwitcher = (gl:WebGLRenderingContext):WebGlBufferSwitcher => {
    let customIdCount = 0;
    let currentId;

    const infoMap = new Map<string, BufferInfo>();

    const assignBuffer = (id:string) => (bData:WebGlBufferData):WebGLBuffer => {
        let info:Partial<BufferInfo>;

        if(infoMap.has(id)) {
            info = infoMap.get(id);
        } else {
            info = {
                buffer: gl.createBuffer()
            }
        }

        info.data = bData.data;
        info.target = bData.target;
        info.usagePattern = bData.usagePattern;

        infoMap.set(id, info as BufferInfo);

        gl.bindBuffer(info.target, info.buffer);
        gl.bufferData(info.target, info.data, info.usagePattern);

        return info.buffer;
    }
    
    const switchBuffer = (id:string):WebGLBuffer => {
        const info = infoMap.get(id);

        if(currentId !== id) {
            gl.bindBuffer(info.target, info.buffer);
        }
        
        return info.buffer;
    }

    const activateBuffer = (id:string) => (opts:WebGlBufferActivateOptions):WebGLBuffer => {
        const buffer = switchBuffer(id);

        gl.vertexAttribPointer( opts.index, 
                                opts.size, 
                                opts.type, 
                                opts.normalized === undefined ? false : opts.normalized,
                                opts.stride === undefined ? 0 : opts.stride,
                                opts.offset === undefined ? 0 : opts.offset);

        gl.enableVertexAttribArray(opts.index);

        return buffer;
    }

    return {
        nextId: () => (++customIdCount).toString(),

        assignBuffer: assignBuffer,
     
        switchBuffer: switchBuffer,

        activateBuffer: activateBuffer
    }
}