import {
    InputEvent,
    parseInputEventFromBinary,
    ScreenEventData,
    serializeInputEventToBinary,
    TickerSourceId,
    ScreenSourceId,
    InputEventSchedule
} from '../../../engine/Exports';
import { createMock } from '../../mock/Mock';


const io = createMock({});

const testRoundtrip = (evt:InputEvent) => {
    const binary = serializeInputEventToBinary (io.inputSerializers) (evt);
    const parsed = parseInputEventFromBinary (io.inputSerializers) (binary);

    expect(parsed).toEqual(evt);
}

test('Serialize - Ticker Event', () => {
    testRoundtrip({
        sourceId: TickerSourceId,
        data: {
            frameTs: 200.42,
            dt: 90
        },
        schedule: InputEventSchedule.RENDER,
        ts: 42
    });
});

test('Serialize - Screen Event', () => {
    const data:ScreenEventData = {
        width: 200,
        height: 300
    }

    testRoundtrip({
        sourceId: ScreenSourceId,
        data: data,
        schedule: InputEventSchedule.IMMEDIATE,
        ts: 42
    });
});
