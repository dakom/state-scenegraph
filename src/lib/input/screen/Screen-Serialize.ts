import { flatbuffers } from 'flatbuffers';

import { Screen } from '../../../flatbuffers/Flatbuffers';
import {ScreenEventData} from "./Screen-Event";
import {Serializer} from "../../serialize/Serialize";
import {SerializeCamera, ParseCamera} from "../../camera/Camera-Serializer";
import {S} from "../../../external/sanctuary/Sanctuary";

const SerializeScreenEvent = (evtData:ScreenEventData) => (builder): number => {
    const maybeCameraPtr = evtData.projection === undefined 
        ? S.Nothing
        : S.Just(SerializeCamera (builder) ({
            eye: evtData.eye,
            projection: evtData.projection,
            matrix: evtData.matrix
        }))
    
    //Serialize everything
    Screen.Event.startEvent(builder);
    Screen.Event.addWidth(builder, evtData.width);
    S.map(camera => Screen.Event.addCamera(builder, camera)) (maybeCameraPtr);
    Screen.Event.addHeight(builder, evtData.height);
    return Screen.Event.endEvent(builder);

}

const SerializeScreenEventToBinary = (evtData:ScreenEventData): Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializeScreenEvent(evtData)(builder));

    return builder.asUint8Array();
}

const ParseScreenEvent = (evtData:Screen.Event): ScreenEventData => {
    const data = {
        width: evtData.width(),
        height: evtData.height()
    } as ScreenEventData;

    const camera = evtData.camera();
    return (camera) 
        ?   {
                ...data,
                ...ParseCamera(camera)
            }
        : data;
}

const ParseScreenEventFromBinary = (bytes: Uint8Array): ScreenEventData =>
    ParseScreenEvent(
        Screen.Event
            .getRootAsEvent(new flatbuffers.ByteBuffer(bytes)));

export const ScreenSerializer:Serializer = {
    serialize: SerializeScreenEventToBinary,
    parse:  ParseScreenEventFromBinary
}