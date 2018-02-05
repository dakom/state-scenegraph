import { Maybe, S } from '../../../external/sanctuary/Sanctuary';
import { InputEvent, InputEventSchedule, InputSender } from '../Input-Event';
import { getScreenSize } from './Screen-Utils';
import {Camera} from "../../camera/Camera";

export interface ScreenEventData extends Partial<Camera>{
    width: number;
    height: number;
};

export const ScreenSourceId = "screen";

export interface ScreenEventOptions {
    sendInitial?:boolean;
    schedule?:InputEventSchedule;
    mapCamera?:(screenSize:{width: number, height:number}) => Camera;
}

const eventMaker = (opts:ScreenEventOptions) => (evt:Event):Maybe<InputEvent> => {
    const screenSize = getScreenSize();

    const result = (
        (evt.defaultPrevented)
        ? S.Nothing
        : S.Just({
            sourceId: ScreenSourceId,
            schedule: opts.schedule,
            data: opts.mapCamera === undefined
                ?   {...screenSize}
                :   {
                        ...screenSize,
                        ...opts.mapCamera(screenSize)
                    },
            ts: evt.timeStamp
        })
    );

    // Cancel the default action to avoid it being handled twice (from mozilla docs)
    evt.preventDefault();

    return result;
}

const normalize = (opts?:ScreenEventOptions):ScreenEventOptions => {

    if(opts === undefined) {
        opts = {} as ScreenEventOptions;
    }

    opts.sendInitial = (opts.sendInitial === true) ? true : false;

    return opts;
}

export const startScreen = (_opts?:ScreenEventOptions) => (send:InputSender) =>  {
    const opts = normalize(_opts);
    const makeEvent = eventMaker(opts);

    const sendEvent = _evt => {
        S.map(send) (makeEvent(_evt))
    }

    window.addEventListener("resize", sendEvent, true);

    if(opts.sendInitial) {
        const screenSize = getScreenSize();
        send({
                sourceId: ScreenSourceId,
                schedule: opts.schedule,
                data: {
                    width: screenSize.width,
                    height: screenSize.height
                }
        })
    }
}