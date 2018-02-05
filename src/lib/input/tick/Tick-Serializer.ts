import { flatbuffers } from 'flatbuffers';

import { Tick } from '../../../flatbuffers/Flatbuffers';
import {TickEventData} from "./Tick-Event";
import {Serializer} from "../../serialize/Serialize";

const SerializeTickEvent = (evtData:TickEventData) => (builder): number => {
    
    
    //Serialize everything
    Tick.Event.startEvent(builder);
    Tick.Event.addFrameTs(builder, evtData.frameTs)
    Tick.Event.addDt(builder, evtData.dt)
    
    return Tick.Event.endEvent(builder);

}

const SerializeTickEventToBinary = (evtData:TickEventData): Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializeTickEvent(evtData)(builder));

    return builder.asUint8Array();
}

const ParseTickEvent = (evtData:Tick.Event): TickEventData =>
    ({
        frameTs: evtData.frameTs(),
        dt: evtData.dt()
    });

const ParseTickEventFromBinary = (bytes: Uint8Array): TickEventData =>
    ParseTickEvent(
        Tick.Event
            .getRootAsEvent(new flatbuffers.ByteBuffer(bytes)));

export const TickSerializer:Serializer = {
    serialize: SerializeTickEventToBinary,
    parse:  ParseTickEventFromBinary
}