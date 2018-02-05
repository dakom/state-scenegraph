import { flatbuffers } from "flatbuffers";
import { Keyboard } from "./../../../flatbuffers/KeyboardEvent_generated";
import {KeyboardEventData, KeyboardEventStatus} from "./Keyboard-Event";
import { InputEvent, InputEventSchedule, InputSender } from '../Input-Event';
import {Serializer} from "../../serialize/Serialize";

const SerializeKeyboardEvent = (builder) => (evtData:KeyboardEventData): number => {
    const keyPtr = builder.createString(evtData.key);
    
    //Serialize everything
    Keyboard.Event.startEvent(builder);
    Keyboard.Event.addStatus(builder, evtData.status);
    Keyboard.Event.addKey(builder, keyPtr);
    return Keyboard.Event.endEvent(builder);

}

const SerializeKeyboardEventToBinary = (evtData:KeyboardEventData): Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializeKeyboardEvent(builder)(evtData));

    return builder.asUint8Array();
}

const ParseKeyboardEvent = (evtData:Keyboard.Event): KeyboardEventData =>
    ({
        status: evtData.status(),
        key: evtData.key()
    });

const ParseKeyboardEventFromBinary = (bytes: Uint8Array): KeyboardEventData =>
    ParseKeyboardEvent(
        Keyboard.Event
            .getRootAsEvent(new flatbuffers.ByteBuffer(bytes)));

export const KeyboardEventSerializer:Serializer = {
    serialize: SerializeKeyboardEventToBinary,
    parse:  ParseKeyboardEventFromBinary
}