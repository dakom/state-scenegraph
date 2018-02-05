import {flatbuffers} from "flatbuffers";
import {NumberArray} from "../array/Array";

import {Matrix4} from "../../flatbuffers/Matrix4_generated";

export const SerializeMatrix4 = (builder) => (props:NumberArray): number => {

    Matrix4.Values.startValues(builder);
    Matrix4.Values.addA(builder, props[0]);
    Matrix4.Values.addB(builder, props[1]);
    Matrix4.Values.addC(builder, props[2]);
    Matrix4.Values.addD(builder, props[3]);

    Matrix4.Values.addE(builder, props[4]);
    Matrix4.Values.addF(builder, props[5]);
    Matrix4.Values.addG(builder, props[6]);
    Matrix4.Values.addH(builder, props[7]);

    Matrix4.Values.addI(builder, props[8]);
    Matrix4.Values.addJ(builder, props[9]);
    Matrix4.Values.addK(builder, props[10]);
    Matrix4.Values.addL(builder, props[11]);

    Matrix4.Values.addM(builder, props[12]);
    Matrix4.Values.addN(builder, props[13]);
    Matrix4.Values.addO(builder, props[14]);
    Matrix4.Values.addP(builder, props[15]);
    return Matrix4.Values.endValues(builder);
}

export const SerializeMatrix4ToBinary = (props:NumberArray):Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializeMatrix4(builder)(props));

    return builder.asUint8Array();
}

export const  ParseMatrix4 = (m:Matrix4.Values):NumberArray => [
    m.a(),
    m.b(),
    m.c(),
    m.d(),

    m.e(),
    m.f(),
    m.g(),
    m.h(),

    m.i(),
    m.j(),
    m.k(),
    m.l(),

    m.m(),
    m.n(),
    m.o(),
    m.p(),
];

export const  ParseMatrix4FromBinary = (bytes:Uint8Array):NumberArray =>
ParseMatrix4(
        Matrix4.Values
            .getRootAsValues(new flatbuffers.ByteBuffer(bytes)));