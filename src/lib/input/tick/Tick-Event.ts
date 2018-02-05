import { Maybe, S } from '../../../external/sanctuary/Sanctuary';
import { InputEvent, InputEventSchedule, InputSender } from '../Input-Event';

export interface TickEventData {
    frameTs:number;
    dt:number;
};

export const TickSourceId = "tick";

export interface TickEventOptions {
    schedule?:InputEventSchedule;
}

const normalize = (opts?:TickEventOptions):TickEventOptions => {

    if(opts === undefined) {
        opts = {} as TickEventOptions;
    }

    return opts;
}

export const startTick = (_opts?:TickEventOptions) => (send:InputSender) =>  {
    let lastTs;

    const opts = normalize(_opts);

    const onTick = (frameTs) => { 
        const evtData:TickEventData = {
            frameTs: frameTs,
            dt: lastTs === undefined ? 0 : ((frameTs -lastTs)/1000)
        }
        lastTs = frameTs;
        
        send
        ({
            sourceId: TickSourceId,
            schedule: opts.schedule,
            data: evtData,
            ts: performance.now()
        })

        requestAnimationFrame(onTick);
    }

    requestAnimationFrame(onTick);
}