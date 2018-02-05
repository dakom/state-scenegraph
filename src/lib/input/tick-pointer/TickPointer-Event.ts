import { Maybe, S } from '../../../external/sanctuary/Sanctuary';
import { InputEvent, InputEventSchedule, InputSender } from '../Input-Event';
import { PointerEventData, PointerEventOptions, getTriggersFromOptions, normalizePointerOptions, pointerEventDataMaker } from '../pointer/Pointer-Event';
import { TickEventData } from '../tick/Tick-Event';

/*
    Basically a combo of pointer and tick
    It only sends on ticks where there is a valid pointer event

    Intended for throttling move on browsers that don't inherently consolidate
*/

export type TickPointerEventData = TickEventData & PointerEventData;

export const TickPointerSourceId = "tickPointer";


export const startTickPointer = (_opts?:PointerEventOptions) => (send:InputSender) =>  {
    let lastTs;
    let lastPointerEvent:MouseEvent = null;

    const opts = normalizePointerOptions(_opts);

    const makePointerData = pointerEventDataMaker(opts);

    const onTick = (frameTs) => {
        if(lastPointerEvent !== null) {
            S.map(pointerEventData => {
                const evtData:TickPointerEventData = {
                    ...pointerEventData,
                    frameTs: frameTs,
                    dt: lastTs === undefined ? 0 : ((frameTs -lastTs)/1000)
                }
                
                lastTs = frameTs;
                
                send
                ({
                    sourceId: TickPointerSourceId,
                    schedule: opts.schedule,
                    data: evtData,
                    ts: performance.now()
                })
            })
            (makePointerData(lastPointerEvent))

            lastPointerEvent = null;
        }
        

        requestAnimationFrame(onTick);
    }

    requestAnimationFrame(onTick);

    getTriggersFromOptions(opts).forEach(trigger => {
        opts.domElement.addEventListener(trigger, (evt:MouseEvent) => {
            if(!evt.defaultPrevented) {
                lastPointerEvent = evt;
            }
            
            evt.preventDefault();
        }, false);
    });
}