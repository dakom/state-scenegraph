import {Transform, transformVectorSpace, getTransformWorldPosition, getTransformPosition, transformVectorInvertedSpace, createWorldTransform} from "../../transform/Transform";
import {NumberArray} from "../../array/Array";
import {sodiumStagedUpdater} from "../updaters/Sodium-StagedUpdate";
import {Stream, Cell} from "sodiumjs";
import {PointerScreenEventData, PointerWorldEventData} from "../../input/Input";
import {screenEventToWorldPoint} from "../../input/screen/Screen";
import {vec3} from "gl-matrix";
import {createVec3} from "../../vector/Vector-Create";

//Currently tested and built for 2D
//TODO: make it work in 3D ;)

export interface DragOptions {
    sPointerStart:Stream<PointerScreenEventData>;
    sPointerMove: Stream<PointerScreenEventData>;
    sCommit:Stream<any>;
    sEnd:Stream<any>;
    getPixelId: ({x,y}:{x: number, y: number}) => number;
}

type PointerDragInitEvent = PointerScreenEventData & {pixelId:number};

export const sodiumDragCreator = (opts:DragOptions) => sodiumStagedUpdater({
    sInit: opts.sPointerStart.map(evtData => 
        Object.assign({}, evtData, { pixelId: opts.getPixelId(evtData) })
    ),
    mapInit: (_evtData: PointerDragInitEvent ) => (transform: Transform): NumberArray => {
        //console.log("init");
        const pointerWorldPoint = screenEventToWorldPoint(_evtData) (_evtData);
        const worldPosition = getTransformWorldPosition(transform);

        const diff = vec3.subtract(createVec3() as any, worldPosition as any, pointerWorldPoint as any);

        return [diff[0], diff[1], 0];
    },

    sUpdate: opts.sPointerMove,
    mapUpdate: (_evtData: PointerScreenEventData) => ([target, initData]:[Transform, NumberArray]):PointerScreenEventData => {
        //console.log("update");
        return {..._evtData}
    },

    sCommit: opts.sCommit,
    mapCommit: (_evtData: any) => ([target,initData,_updateData]:[Transform, NumberArray, PointerScreenEventData]):Transform => {
        //console.log("commit");

        //on commit, do the heavy lifting - this is once per frame and only when there's a valid update
        const pointerWorldPoint = screenEventToWorldPoint(_updateData) (_updateData);
        const offsetWorldPoint =
            vec3.add(createVec3() as any, pointerWorldPoint as any, initData as any);

        const localPoint = transformVectorInvertedSpace(offsetWorldPoint)(target.parentWorldSpace);

        return createWorldTransform({
            posX: localPoint[0],
            posY: localPoint[1]
        })
    },

    sEnd: opts.sEnd,
});