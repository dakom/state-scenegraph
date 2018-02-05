import { Maybe, S } from '../../../external/sanctuary/Sanctuary';
import { InputEvent, InputEventSchedule, InputSender } from '../Input-Event';
import * as R from "ramda";

export interface KeyboardEventData {
    status: KeyboardEventStatus,
    key: string
};

export enum KeyboardEventStatus {
    PRESS = 1,
    RELEASE = 2
}

export const KeyboardSourceId = "keyboard";

export type KeyboardEventValidator = (data:KeyboardEventData) => boolean;

export interface KeyboardEventOptions {
    validate?:(evt:KeyboardEventData) => boolean
    schedule?:InputEventSchedule;
}

const eventMaker = (opts?:KeyboardEventOptions) => (evt:KeyboardEvent):Maybe<InputEvent> => {
    const data = {
        status: evt.type === "keyup" ? KeyboardEventStatus.RELEASE : KeyboardEventStatus.PRESS,
        key: evt.key
    };

    const result = (
        (evt.defaultPrevented || (!R.isNil(opts.validate) && !opts.validate(data)))
        ? S.Nothing
        : S.Just({
            sourceId: KeyboardSourceId,
            schedule: opts.schedule,
            data: data,
            ts: evt.timeStamp
        })
    );

    // Cancel the default action to avoid it being handled twice (from mozilla docs)
    evt.preventDefault();

    return result;
}

const normalize = (opts?:KeyboardEventOptions):KeyboardEventOptions => {

    if(opts === undefined) {
        opts = {} as KeyboardEventOptions;
    }

    return opts;
}

export const startKeyboard = (opts?:KeyboardEventOptions) => (send:InputSender) => {
    const makeEvent = eventMaker(normalize(opts));

    const sendEvent = evt => S.map(send) (makeEvent(evt));
    
    document.addEventListener("keydown", sendEvent, true);
    document.addEventListener("keyup", sendEvent, true);
}