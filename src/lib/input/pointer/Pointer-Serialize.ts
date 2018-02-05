import { flatbuffers } from "flatbuffers";
import { Pointer } from "../../../flatbuffers/PointerEvent_generated";
import {PointerEventData} from "./Pointer-Event";
import {Serializer} from "../../serialize/Serialize";

const SerializePointerEvent =  (builder) => (evtData:PointerEventData): number => {
    //Serialize everything
    Pointer.Event.startEvent(builder);
    Pointer.Event.addStatus(builder, evtData.status);
    if(evtData.x !== undefined) {
        Pointer.Event.addX(builder, evtData.x);
    } 
    
    if(evtData.y !== undefined) {
        Pointer.Event.addY(builder, evtData.y);
    }

    Pointer.Event.addHasX(builder, evtData.x !== undefined);
    Pointer.Event.addHasY(builder, evtData.y !== undefined);
  
    return Pointer.Event.endEvent(builder);

}

const SerializePointerEventToBinary = (evtData:PointerEventData): Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializePointerEvent(builder)(evtData));

    return builder.asUint8Array();
}

const ParsePointerEvent = (evtData:Pointer.Event): PointerEventData => {
    const ret:any = {
        status: evtData.status()
    }

    if(evtData.hasX()) {
        ret.x = evtData.x();
    }

    if(evtData.hasY()) {
        ret.y = evtData.y();
    }

    return ret;
}

const ParsePointerEventFromBinary = (bytes: Uint8Array): PointerEventData =>
    ParsePointerEvent(
        Pointer.Event
            .getRootAsEvent(new flatbuffers.ByteBuffer(bytes)));

export const PointerEventSerializer:Serializer = {
    serialize: SerializePointerEventToBinary,
    parse:  ParsePointerEventFromBinary
}