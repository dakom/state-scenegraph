import { flatbuffers } from "flatbuffers";
import { Transform as TransformData} from "../../flatbuffers/Flatbuffers";

import {SerializeMatrix4, ParseMatrix4} from "../matrix/Matrix"
import {SerializeVector4, ParseVector4} from "../vector/Vector";
import {Transform} from "./Transform-Utils";
import {S} from "../../external/sanctuary/Sanctuary";

export const SerializeTransform = (builder)=>(props: Transform): number => {
    const localSpacePtr = SerializeMatrix4 (builder) (props.localSpace);

    const maybeWorldSpacePtr = props.worldSpace 
        ? S.Just(SerializeMatrix4 (builder) (props.worldSpace))
        : S.Nothing;
    const maybeParentWorldSpacePtr = props.parentWorldSpace
        ? S.Just(SerializeMatrix4 (builder) (props.parentWorldSpace))
        : S.Nothing;

    
    //Serialize everything
    TransformData.Props.startProps(builder);
    TransformData.Props.addPosX(builder, props.posX);
    TransformData.Props.addPosY(builder, props.posY);
    TransformData.Props.addPosZ(builder, props.posZ);
    TransformData.Props.addOriginX(builder, props.originX);
    TransformData.Props.addOriginY(builder, props.originY);
    TransformData.Props.addOriginZ(builder, props.originZ);
    TransformData.Props.addScaleX(builder, props.scaleX);
    TransformData.Props.addScaleY(builder, props.scaleY);
    TransformData.Props.addScaleZ(builder, props.scaleZ);
    TransformData.Props.addRotX(builder, props.rotX);
    TransformData.Props.addRotY(builder, props.rotY);
    TransformData.Props.addRotZ(builder, props.rotZ);
    TransformData.Props.addRotW(builder, props.rotW);
    TransformData.Props.addLocalSpace(builder, localSpacePtr);

    S.map(worldSpace => TransformData.Props.addWorldSpace(builder, worldSpace)) (maybeWorldSpacePtr);
    S.map(parentWorldSpace => TransformData.Props.addParentWorldSpace(builder, parentWorldSpace)) (maybeParentWorldSpacePtr);
    return TransformData.Props.endProps(builder);

}

export const SerializeTransformToBinary = (props: Transform): Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializeTransform(builder)(props));

    return builder.asUint8Array();
}

export const ParseTransform = (props:TransformData.Props): Transform => {
    
    
    const t = {
        posX: props.posX(),
        posY: props.posY(),
        posZ: props.posZ(),
        originX: props.originX(),
        originY: props.originY(),
        originZ: props.originZ(),
        scaleX: props.scaleX(),
        scaleY: props.scaleY(),
        scaleZ: props.scaleZ(),
        rotX: props.rotX(),
        rotY: props.rotY(),
        rotZ: props.rotZ(),
        rotW: props.rotW(),
        localSpace: ParseMatrix4(props.localSpace()),
    } as Transform;

    const worldSpace = props.worldSpace();
    const parentWorldSpace = props.parentWorldSpace();
    if(worldSpace !== null) {
        t.worldSpace = ParseMatrix4(props.worldSpace());
    }
    if(parentWorldSpace !== null) {
        t.parentWorldSpace = ParseMatrix4(props.parentWorldSpace());
    }
    return t;
}

export const ParseTransformFromBinary = (bytes: Uint8Array): Transform =>
    ParseTransform(
        TransformData.Props
            .getRootAsProps(new flatbuffers.ByteBuffer(bytes)));