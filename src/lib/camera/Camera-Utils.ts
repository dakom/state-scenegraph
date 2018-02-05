import {NumberArray} from "../array/Array";
import {mat4, vec3} from "gl-matrix";
import {createMat4} from "../matrix/Matrix";
import {createVec3} from  "../vector/Vector";


export interface Camera {
    projection: NumberArray;
    eye: NumberArray;
    matrix: NumberArray;
}



export interface CameraPerspectiveOptions {
    fov: number;
    aspect: number;
    near: number;
    far: number;

    origin: NumberArray;
    dest: NumberArray;
    up: NumberArray;
}



export const getCameraOrthoFullscreen = ({width, height}:{width:number, height:number}):Camera => {
    const props:Partial<Camera> = {
        projection: mat4.ortho(createMat4() as any, 0, width, 0, height, 0, 1) as any,
        eye: createMat4()
    }

    props.matrix = getCameraMatrixFromProps(props);
    
    return props as Camera;
}



export const getCameraPerspective = (opts:CameraPerspectiveOptions):Camera => {
    const props:Partial<Camera> = {
        projection: mat4.perspective(createMat4() as any, opts.fov, opts.aspect, opts.near, opts.far)  as any,
        eye: mat4.lookAt(createMat4() as any, opts.origin as any, opts.dest as any, opts.up as any)  as any
    }
    props.matrix = getCameraMatrixFromProps(props);

    return props as Camera;
}

export const getCameraMatrixFromProps = (props:Partial<Camera>):NumberArray =>
    mat4.multiply(createMat4() as any, props.projection as any, props.eye as any) as any

//Not really tested so much...
export const unprojectFromCamera = (camera:Camera) => (point:NumberArray):NumberArray => {
    const invMatrix = 
        mat4.multiply(
            createMat4() as any,
            mat4.invert(createMat4() as any, camera.projection as any),
            mat4.invert(createMat4() as any, camera.eye as any)
        )

    return vec3.transformMat4(createVec3() as any, point as any, invMatrix) as any;
}



