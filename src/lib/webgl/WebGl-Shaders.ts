import {S,Maybe, Either} from "../../external/sanctuary/Sanctuary";


export interface WebGlShaderSwitcher {
    createShader: (id:string) => (source:WebGlShaderSource)=> WebGlProgramInfo;
    getUniformLocation: (id:string) => (uName:string) => WebGLUniformLocation;
    getAttributeLocation: (id:string) => (aName:string) => number;
    switchShaderProgram: (id:string) => WebGLProgram;
}

export interface WebGlProgramInfo {
    id: string;
    program:WebGLProgram;
    uniformLocations: Map<string, WebGLUniformLocation>;
    attributeLocations: Map<string, number>;
}

export interface WebGlShaderSource {
    vertex:string;
    fragment:string;
}


export const CompileShader = (gl: WebGLRenderingContext) => (source:WebGlShaderSource): WebGLProgram => {
    
    const loadSource = (gl: WebGLRenderingContext) => (shaderType: number) => (sourceText: string): Either<WebGLShader | Error> => {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, sourceText);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const errorMessage = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            return S.Left(new Error(errorMessage));
        }

        return S.Right(shader);
    }

    const loadShader = (shaderType: number) => (sourceText: string) => (shaderProgram:WebGLProgram) => S.chain(
        shader => {
            gl.attachShader(shaderProgram,shader); 
            return S.Right(shaderProgram);
        },
        loadSource(gl)(shaderType)(sourceText)
    );

    
    const linkShader = (shaderProgram:WebGLProgram) => {
        gl.linkProgram(shaderProgram)
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            const errorMessage = 'Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram);
            gl.deleteProgram(shaderProgram);
            return S.Left(new Error(errorMessage));
        }

        return S.Right(shaderProgram);
    }

   
    const eitherShader:Either<WebGLProgram | Error> = S.pipe([
        S.chain(loadShader(gl.VERTEX_SHADER) (source.vertex)),
        S.chain(loadShader(gl.FRAGMENT_SHADER) (source.fragment)), 
        S.chain(linkShader),
    ])(S.Right(gl.createProgram()));

    if(eitherShader.isLeft) {
        //blow things up
        throw eitherShader.value;
    } else {
        return eitherShader.value;
    }
    
}

export const createWebGlShaderSwitcher = (gl:WebGLRenderingContext):WebGlShaderSwitcher => {
    let current:Partial<WebGlProgramInfo> = {};
    
    const programs = new Map<string, WebGlProgramInfo>();
    
    const switchShaderProgram = (id:string):WebGLProgram => {
        const programInfo = programs.get(id);        
        if(current.id !== id) {
            current = programInfo;
            gl.useProgram(current.program);
        }
        return current.program;
    }

    return {
        createShader: (id:string) => (source:WebGlShaderSource) => {
            const info:WebGlProgramInfo = {
                id: id,
                program: CompileShader (gl) (source),
                uniformLocations: new Map<string, WebGLUniformLocation>(),
                attributeLocations: new Map<string, number>()
            };

            programs.set(id, info);
            return info;
        },

        switchShaderProgram: switchShaderProgram,

        getUniformLocation: (id:string) => (uName:string):WebGLUniformLocation => {
            if(current.id !== id) {
                switchShaderProgram(id);
            }
            if(!current.uniformLocations.has(uName)) {
                current.uniformLocations.set(uName, gl.getUniformLocation(current.program, uName))
            }
            return current.uniformLocations.get(uName);
        },
        getAttributeLocation: (id:string) => (aName:string):number => {
            if(current.id !== id) {
                switchShaderProgram(id);
            }
            if(!current.attributeLocations.has(aName)) {
                current.attributeLocations.set(aName, gl.getAttribLocation(current.program, aName))
            }
            return current.attributeLocations.get(aName);
        }
    }
}