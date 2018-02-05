import { ScreenEventData} from './Screen-Event';
import {Camera, unprojectFromCamera} from "../../camera/Camera";
import {NumberArray} from "../../array/Array";
import {vec3} from "gl-matrix";
import {createVec3} from "../../vector/Vector";

export const getScreenSize = ():ScreenEventData => ({
    width: window.innerWidth,
    height: window.innerHeight
});

//Not tested so much
export const screenToWorldPoint = (stageSize:{width:number, height:number}) => (camera:Camera) => ({x,y}:{x: number, y:number}):NumberArray => {
    /*const worldPointOrtho = NumberArray.from([
        x,
        stageSize.height - y,
        0
    ]);
*/
    // Project it by camera to get clip space
    const worldPoint = vec3.transformMat4(createVec3() as any, [x,y,0] as any, camera.matrix as any) as any;

    //Unproject it to then get real world space by camera view
    return unprojectFromCamera (camera) (worldPoint);
}

//partially applied, last param is {x,y}
export const screenEventToWorldPoint = (evtData:ScreenEventData) =>
    screenToWorldPoint(evtData) (evtData as Camera);
