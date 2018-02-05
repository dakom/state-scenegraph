import { Either, Maybe, S } from '../../external/sanctuary/Sanctuary';
import {PointerEventData} from "./pointer/Pointer-Event";
import {ScreenEventData} from "./screen/Screen-Event";
import {TickEventData} from "./tick/Tick-Event";
import {TickPointerEventData} from "./tick-pointer/TickPointer-Event";
import {Camera} from "../camera/Camera";

import {NumberArray} from "../array/Array";

import * as R from "ramda";

export interface InputEvent {
    sourceId: string;
    schedule?: InputEventSchedule;
    data?: any;
    ts?:number;
}

export enum InputEventSchedule {
    IMMEDIATE = "immediate",
    MICROTASK = "microtask",
    NEXTFRAME = "nextFrame"
}

export type InputSender = (evt:InputEvent) => void;

export interface ScheduledInputSenderOptions {
    defaultSchedule: InputEventSchedule;
    send: InputSender;
}

export const makeTimestampedInputSender = (send:InputSender):InputSender => (_evt:InputEvent) =>
    send(
        (_evt.ts === undefined)
            ? Object.assign({}, _evt, {ts: performance.now()})
            : _evt
    );
    
export const makeScheduledInputSender = (opts: ScheduledInputSenderOptions): InputSender => (evt: InputEvent) => {
    if (evt.schedule === undefined) {
        evt.schedule = opts.defaultSchedule;
    }

    switch (evt.schedule) {
        case InputEventSchedule.IMMEDIATE:
            opts.send(evt);
            break;
        case InputEventSchedule.MICROTASK:
            Promise.resolve().then(() => opts.send(evt));
            break;
        case InputEventSchedule.NEXTFRAME:
            setTimeout(() => opts.send(evt), 0);
            break;
    }
}

/* Useful combinations */
export type TickScreenEventData = TickEventData & ScreenEventData;
export type PointerScreenEventData = PointerEventData & ScreenEventData;
export type TickPointerScreenEventData = TickPointerEventData & ScreenEventData;

export interface TickWorldEventData extends TickScreenEventData {
    worldPoint: NumberArray //in vector form since this will usually be passed to transform functions
}

export interface PointerWorldEventData extends PointerScreenEventData {
    worldPoint: NumberArray //in vector form since this will usually be passed to transform functions
}

export interface TickPointerWorldEventData extends TickPointerScreenEventData {
    worldPoint: NumberArray //in vector form since this will usually be passed to transform functions
}

