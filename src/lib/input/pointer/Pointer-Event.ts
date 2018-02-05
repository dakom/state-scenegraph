import * as R from 'ramda';

import { Maybe, S } from '../../../external/sanctuary/Sanctuary';
import { InputEvent, InputEventSchedule, InputSender } from '../Input-Event';
import { getPointerCoordsFromDomElement } from '../Input-Utils';


export const PointerSourceId = "pointer";

export type PointerEventValidator = (data: PointerEventData) => boolean;

export enum PointerEventStatus {
    START = 1,
    MOVE = 2,
    END = 3,
    UNKNOWN = 4
}

export interface PointerEventData {
    status: PointerEventStatus,
    x:number;
    y:number;
};

export interface PointerEventOptions {
    domElement: HTMLElement;
    hasPointer:boolean;
    status:PointerEventStatus;
    validate?: (evt: PointerEventData) => boolean;
    schedule?:InputEventSchedule;
    
}

export const getTriggersFromOptions = (opts:PointerEventOptions):Array<string> => {
    switch(opts.status) {
        case PointerEventStatus.START:
            return opts.hasPointer
                ?   ["pointerdown"]
                :   ["mousedown", "touchstart"]
        case PointerEventStatus.MOVE:
            return opts.hasPointer
                ?   ["pointermove"]
                :   ["mousemove", "touchmove"]
        case PointerEventStatus.END:
            return opts.hasPointer
                ?   ["pointerup"]
                :   ["mouseup", "touchend"]
    }

    return []
}

export const normalizePointerOptions = (opts?:PointerEventOptions):PointerEventOptions => {

    if(opts === undefined) {
        opts = {} as PointerEventOptions;
    }

    return opts;
}

export const pointerEventDataMaker = (opts: PointerEventOptions) => {
    const getCoords = getPointerCoordsFromDomElement(opts.domElement);

    return (evt: MouseEvent): Maybe<PointerEventData> => {
        let result = S.Nothing;

        const { x, y } = getCoords(evt);

        const data: PointerEventData = {
            status: opts.status,
            x: x,
            y: y,
        };

        result =
            (!R.isNil(opts.validate) && !opts.validate(data))
                ? S.Nothing
                : S.Just(data);

        //console.log(result);
        return result;
    }
}

export const pointerEventMaker = (opts: PointerEventOptions) => {
    const dataMaker = pointerEventDataMaker(opts);

    return (evt: MouseEvent): Maybe<InputEvent> => {
        const result = 
            evt.defaultPrevented
                ?   S.Nothing
                :   S.map((data:PointerEventData) => ({
                        sourceId: PointerSourceId,
                        schedule: opts.schedule,
                        data: data,
                        ts: evt.timeStamp
                    }))
                    (dataMaker(evt))

        evt.preventDefault();

        return result;
    }
}

export const startPointer = (_opts?: PointerEventOptions) => (send:InputSender) => {
    const opts = normalizePointerOptions(_opts);
    const makeEvent = pointerEventMaker(opts);

    const sendEvent = evt => S.map(send) (makeEvent(evt));

    getTriggersFromOptions(opts).forEach(trigger => {
        opts.domElement.addEventListener(trigger, sendEvent, false);
    });
    
}