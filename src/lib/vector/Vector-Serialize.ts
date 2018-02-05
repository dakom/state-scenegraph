import { flatbuffers } from "flatbuffers";
import { Vector3 } from "../../flatbuffers/Vector3_generated";
import { Vector4 } from "../../flatbuffers/Vector4_generated";
import { vec3, vec4 } from "gl-matrix";
import { NumberArray } from "../array/Array";

//Vector3
export const SerializeVector3 = (builder) => (props: NumberArray): number => {

    Vector3.Values.startValues(builder);
    Vector3.Values.addA(builder, props[0]);
    Vector3.Values.addB(builder, props[1]);
    Vector3.Values.addC(builder, props[2]);
    return Vector3.Values.endValues(builder);
}

export const SerializeVector3ToBinary = (props: NumberArray): Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializeVector3(builder)(props));

    return builder.asUint8Array();
}

export const ParseVector3 = (props: Vector3.Values): NumberArray =>
    [props.a(), props.b(), props.c()];

export const ParseVector3FromBinary = (bytes: Uint8Array): NumberArray =>
    ParseVector3(
        Vector3.Values
            .getRootAsValues(new flatbuffers.ByteBuffer(bytes)));

//Vector4

export const SerializeVector4 = (builder) => (props: NumberArray): number => {

    Vector4.Values.startValues(builder);
    Vector4.Values.addA(builder, props[0]);
    Vector4.Values.addB(builder, props[1]);
    Vector4.Values.addC(builder, props[2]);
    Vector4.Values.addD(builder, props[3]);

    return Vector4.Values.endValues(builder);
}

export const SerializeVector4ToBinary = (props: NumberArray): Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializeVector4(builder)(props));

    return builder.asUint8Array();
}

export const ParseVector4 = (props: Vector4.Values): NumberArray =>
    [props.a(), props.b(), props.c(), props.d()];

export const ParseVector4FromBinary = (bytes: Uint8Array): NumberArray =>
    ParseVector4(
        Vector4.Values
            .getRootAsValues(new flatbuffers.ByteBuffer(bytes)));