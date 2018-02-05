import { Cell, Stream } from 'sodiumjs';

import { S } from '../../../external/sanctuary/Sanctuary';

export type SodiumStagedUpdateValidator = (evtData: any) => boolean;


//`A` must be Maybe<any>
//Typescript doesn't yet support typing this exactly, yet
export interface SodiumStagedUpdateOptions<A,B,C,D,E,F> {
    sInit: Stream<B>;
    mapInit: (evtData: B) => (target: A) => E;

    sUpdate: Stream<C>;
    mapUpdate: (evtData: C) => ([target, initData]:[A,E]) => F;

    sCommit: Stream<D>;
    mapCommit: (evtData: D) => ([target, initData, updateData]:[A,E,F]) => A;
    
    sEnd: Stream<any>;
}

export const sodiumStagedUpdater = <A,B,C,D,E,F>(opts: SodiumStagedUpdateOptions<A,B,C,D,E,F>) => (validator: SodiumStagedUpdateValidator) => (cTarget: Cell<A>):Cell<A> => { 
    const cInit =
        opts.sInit
            .snapshot(cTarget, (evtData, fTarget) => 
                validator(evtData)
                    ?   S.map(target => 
                            [target, opts.mapInit(evtData) (target)]
                        )
                        (fTarget)

                    :   S.Nothing
            )
            .orElse(opts.sEnd.map(() => S.Nothing)) //This will mark the cycle as finished
            .hold(S.Nothing);

    const cHasInit = cInit.map(S.isJust) as Cell<boolean>;

    const cUpdate =
        opts.sUpdate
            .gate(cHasInit) //if it hasn't inited, don't even propogate
            .snapshot(cInit, (evtData, fInit) =>
                S.map((args) => 
                    args.concat(opts.mapUpdate(evtData) (args))
                )
                (fInit)
            )
            .orElse(opts.sCommit.map(() => S.Nothing)) //This will mark the update as completed (otherwise it's always-dirty)
            .hold(S.Nothing)

    const cHasUpdate = cUpdate.map(S.isJust) as Cell<boolean>;

    const cCommit =
        opts.sCommit
            .gate(cHasInit) //if it hasn't inited 
            .gate(cHasUpdate) //OR updated, don't propogate
            .snapshot(cUpdate, (evtData, fUpdate) => 
                S.map(opts.mapCommit(evtData)) (fUpdate)
            )
            .hold(S.Nothing);

    
    return cCommit;
    
}