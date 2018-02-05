import {Stream, Cell, Tuple2} from "sodiumjs";

/*
    Usage is three steps:

    1. Create an array of config objects via sodiumAccumConfig()
    2. Create the accumulator via sodiumAccumulator()
    3. Grab the resulting Cell<SodiumAccumState<T,any,S>> from the updater

    The full state is passed to the mappers, but often that's overkill
    The simple case of just event and state data can be passed by wrapping the mapper with sodiumAccumSimpleMapper()
*/

export type SodiumAccumState<T,E,S> = {
    data: S;
    evt?: SodiumAccumEvent<T,E>; //this is the event that _caused_ the state change. Initial state will be undefined
    prev?: SodiumAccumState<T,E,S>; //similarly, initial state will not have a previous state
};

export type SodiumAccumMapper<T,E,S> = (eventData:E) => (state:SodiumAccumState<T,any,S>) => S;
export type SodiumAccumMapperSimple<E,S> = (eventData:E) => (stateData:S) => S;

export interface SodiumAccumEvent<T,E> {
    type: T,
    data: E
}

export interface SodiumAccumConfig <T,E,S>{
    type:T;
    stream:Stream<E>;
    mapper: SodiumAccumMapper<T,E,S>;
}

export interface SodiumAccumConfigSimple <T,E,S>{
    type:T;
    stream:Stream<E>;
    mapper: SodiumAccumMapperSimple<E,S>;
}

export const sodiumAccumSimpleMapper = <T,E,S>(fn:SodiumAccumMapperSimple<E,S>):SodiumAccumMapper<T,E,S> =>
    (evtData:E) => (accumState:SodiumAccumState<T, any, S>) => fn(evtData) (accumState.data);



export const sodiumAccumulate = <T,S>(configs:Array<SodiumAccumConfig<T,any,S>>) => (init:SodiumAccumState<T,any,S>):Cell<SodiumAccumState<T,any,S>> => {
    const mappers = new Map<T, SodiumAccumMapper<T,any,S>>();
    configs.forEach(({type, mapper}) => mappers.set(type, mapper));

    return configs.reduce((streams:Stream<{data: any, type: T}>, config) => {
        const stream = config.stream.map(evtData => ({
            data: evtData,
            type: config.type
        }))

        return streams === null
            ?   stream
            :   streams.orElse(stream)
    }, null)
    .accum(init, (evt, current) => 
        ({
            data: mappers.get(evt.type) (evt.data) (current),
            evt: evt,
            prev: {
                data: current.data,
                evt: current.evt
            }
        })
    )
}


export const sodiumAccumulateSimple = <T,S>(configs:Array<SodiumAccumConfigSimple<T,any,S>>) => (init:SodiumAccumState<T,any,S>):Cell<SodiumAccumState<T,any,S>> => 
    sodiumAccumulate(
        configs.map(simple => ({
            type: simple.type,
            stream: simple.stream,
            mapper: sodiumAccumSimpleMapper(simple.mapper)
        }) as SodiumAccumConfig<T,any,S>)
    )
    (init)

export const sodiumAccumulateSimpleState = <T,S>(configs:Array<SodiumAccumConfigSimple<T,any,S>>) => (init:SodiumAccumState<T,any,S>):Cell<S> => 
    sodiumAccumulate(
        configs.map(simple => ({
            type: simple.type,
            stream: simple.stream,
            mapper: sodiumAccumSimpleMapper(simple.mapper)
        }) as SodiumAccumConfig<T,any,S>)
    )
    (init)
    .map(state => state.data)