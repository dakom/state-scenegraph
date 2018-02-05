//Sodium wrappers around loaders/*

//Returning new Sinks seemed to break things across library boundries - so these expect
//The sinks to be pre-created

import {
    loadXhrFactory, LoaderXhr, LoaderXhrRequest, LoaderXhrResponse, LOADER_TYPE_XHR,
    loadImageFactory, LoaderImage, LoaderImageRequest, LoaderImageResponse, LOADER_TYPE_IMAGE,
    loadTextureFactory, LoaderTexture, LoaderTextureRequest, LoaderTextureResponse, LOADER_TYPE_TEXTURE,
    LoaderResponseAny,
    LoaderRequestAny,
    LoaderCallbackAny,
    LoaderAny,
    isLoaderXhr
} from "../../loaders/Loaders";

import { Stream, StreamSink, Cell } from 'sodiumjs';
import { Maybe, S, Either } from '../../../external/sanctuary/Sanctuary';

/*

Each sodium loader is considered 1:1 to a Loader instance

If you need different loaders (e.g. not disposing the previous)
You must create new SodiumLoaders per instance
*/

export interface SodiumMaybeLoader {
    request:Cell<Maybe<LoaderRequestAny>> | Stream<Maybe<LoaderRequestAny>>;
    sResponse:StreamSink<Maybe<Either<LoaderResponseAny>>>;
    mCancel:Maybe<Stream<any>>;
}

export interface SodiumLoader {
    request:Cell<LoaderRequestAny> | Stream<LoaderRequestAny>;
    sResponse:StreamSink<Maybe<Either<LoaderResponseAny>>>;
    mCancel:Maybe<Stream<any>>;
}

const loaderToMaybe = (ldr:SodiumLoader):SodiumMaybeLoader => ({
    request: (ldr.request as any).map(S.Just) as Cell<Maybe<LoaderRequestAny>> | Stream<Maybe<LoaderRequestAny>>,
    sResponse: ldr.sResponse,
    mCancel: ldr.mCancel,
});

const closeLoader = S.map((ldr:LoaderAny) => {
    if(isLoaderXhr(ldr)) {
        ldr.close();
    }
})

//It isn't optimized to deal with pending loaders, only completed ones
//In other words, a new load triggered while a pending load is active, will issue a new request and overrite the cache when finished
//Also - FRP must be created in the calling app, so it requires as a parameter
const _createSodiumMaybeLoaderImpureCache = 
    (loadFactory:(req:LoaderRequestAny, callback:LoaderCallbackAny) => LoaderAny) => 
    (cache:Map<LoaderRequestAny, Either<LoaderResponseAny>>) => 
    (sodiumLoader:SodiumMaybeLoader):SodiumMaybeLoader => {
        let mLdr:Maybe<LoaderAny> = S.Nothing;

        const doClose = () => {
            closeLoader(mLdr);
            mLdr = S.Nothing;
        }
        sodiumLoader.request.listen(mReq => {
            doClose();

            //listen->send must push to the next callstack
            setTimeout(() => S.maybe_
                (() => sodiumLoader.sResponse.send(S.Nothing))
                (req => {
                    if(cache.has(req)) {
                        sodiumLoader.sResponse.send(S.Just(cache.get(req)));
                    } else {
                        sodiumLoader.sResponse.send(S.Nothing);
                        //loading inherently will be on the next stack, or at worst as a microtask
    
                        mLdr = S.Just(
                            loadFactory(req, eResponse => {
                                cache.set(req, eResponse);
                                sodiumLoader.sResponse.send(S.Just(eResponse));
                                doClose();
                            })
                        );
                    }
                })
                (mReq)
            , 0);
        });

        S.map(sCancel => {
            sCancel.listen(() => {
                doClose();
            })
        })
        (sodiumLoader.mCancel)

        return sodiumLoader;
    }

export const createSodiumMaybeLoaderImpureCacheTexture = _createSodiumMaybeLoaderImpureCache(loadTextureFactory);
export const createSodiumMaybeLoaderImpureCacheImage = _createSodiumMaybeLoaderImpureCache(loadImageFactory);
export const createSodiumMaybeLoaderImpureCacheXhr = _createSodiumMaybeLoaderImpureCache(loadXhrFactory);

const _createSodiumLoaderImpureCache = 
    (loadFactory:(req:LoaderRequestAny, callback:LoaderCallbackAny) => LoaderAny) => 
    (cache:Map<LoaderRequestAny, Either<LoaderResponseAny>>) => 
    (sodiumLoader:SodiumLoader):SodiumLoader => {
        _createSodiumMaybeLoaderImpureCache (loadFactory) (cache) (loaderToMaybe(sodiumLoader));
        return sodiumLoader;
    }

export const createSodiumLoaderImpureCacheTexture = _createSodiumLoaderImpureCache(loadTextureFactory);
export const createSodiumLoaderImpureCacheImage = _createSodiumLoaderImpureCache(loadImageFactory);
export const createSodiumLoaderImpureCacheXhr = _createSodiumLoaderImpureCache(loadXhrFactory);


const _createSodiumMaybeLoader = 
    (loadFactory:(req:LoaderRequestAny, callback:LoaderCallbackAny) => LoaderAny) => 
    (sodiumLoader:SodiumMaybeLoader):SodiumMaybeLoader => {
        let mLdr:Maybe<LoaderAny> = S.Nothing;

        const doClose = () => {
            closeLoader(mLdr);
            mLdr = S.Nothing;
        }

        sodiumLoader.request.listen(mReq => {
            doClose();

            //Sending must wait until the next stack
            setTimeout(() => S.maybe_
                (() => sodiumLoader.sResponse.send(S.Nothing))
                (req => {
                    sodiumLoader.sResponse.send(S.Nothing);
                    //loading inherently will be on the next stack, or at worst as a microtask
                    mLdr = S.Just(
                        loadFactory(req, eResponse => {
                            sodiumLoader.sResponse.send(S.Just(eResponse));
                            doClose();
                        })
                    );
                })
                (mReq)
            , 0);
        });

        S.map(sCancel => {
            sCancel.listen(() => {
                doClose();
            })
        })
        (sodiumLoader.mCancel)

        return sodiumLoader;
    }


export const createSodiumMaybeLoaderTexture = _createSodiumMaybeLoader(loadTextureFactory);
export const createSodiumMaybeLoaderImage = _createSodiumMaybeLoader(loadImageFactory);
export const createSodiumMaybeLoaderXhr = _createSodiumMaybeLoader(loadXhrFactory);

const _createSodiumLoader = 
    (loadFactory:(req:LoaderRequestAny, callback:LoaderCallbackAny) => LoaderAny) => 
    (sodiumLoader:SodiumLoader):SodiumLoader => {
        _createSodiumMaybeLoader(loadFactory) (loaderToMaybe(sodiumLoader));
        return sodiumLoader;
    }

export const createSodiumLoaderTexture = _createSodiumLoader(loadTextureFactory);
export const createSodiumLoaderImage = _createSodiumLoader(loadImageFactory);
export const createSodiumLoaderXhr = _createSodiumLoader(loadXhrFactory);