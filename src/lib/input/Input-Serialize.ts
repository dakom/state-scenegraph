import {flatbuffers} from "flatbuffers";
import {Input} from "../../flatbuffers/Flatbuffers";
import {Serializers, Serializer} from "../serialize/Serialize";
import {InputEvent, InputEventSchedule} from "./Input-Event";
import * as R from "ramda";
import {S} from "../../external/sanctuary/Sanctuary";

export const serializeInputEvent = builder => (serializers:Serializers) => (evt:InputEvent):Uint8Array => {
    const sourceIdPtr = builder.createString(evt.sourceId);
    
    const maybeSchedulePtr = 
        R.isNil (evt.schedule)
        ?   S.Nothing
        :   S.Just(builder.createString(evt.schedule));

    const maybeDataPtr = 
        R.isNil (evt.data)
        ?   S.Nothing
        :   serializers.has(evt.sourceId)
            ?   S.Just(Input.Event.createDataVector(builder, serializers.get(evt.sourceId).serialize (evt.data)))
            :   S.Nothing;

    Input.Event.startEvent(builder);
    Input.Event.addSourceId(builder, sourceIdPtr);
    Input.Event.addTs(builder, evt.ts);
    S.map
        (dataPtr  => Input.Event.addData(builder, dataPtr))
        (maybeDataPtr);
    S.map
        (schedulePtr  => Input.Event.addSchedule(builder, schedulePtr))
        (maybeSchedulePtr);
    return Input.Event.endEvent(builder);
}

export const serializeInputEventToBinary = (serializers:Serializers) => (evt:InputEvent):Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(serializeInputEvent (builder) (serializers) (evt));
    return builder.asUint8Array();
}

export const parseInputEvent = (serializers:Serializers) => (evt:Input.Event):InputEvent => {
    const ret = {} as InputEvent;

    ret.sourceId = evt.sourceId();
    ret.ts = evt.ts();
    
    if(evt.dataLength() && serializers.has(ret.sourceId)) {
        ret.data = serializers.get(ret.sourceId).parse(evt.dataArray())
    }

    const schedule = evt.schedule();
    
    if(!R.isNil(schedule)) {
        ret.schedule = evt.schedule() as InputEventSchedule;
    }
    
    return ret;
}


export const parseInputEventFromBinary = (serializers:Serializers) => (bytes:Uint8Array):InputEvent =>
    parseInputEvent(serializers) (Input.Event.getRootAsEvent(new flatbuffers.ByteBuffer(bytes)));