import {sameOrigin} from "../headers/Headers-Cors";
import * as R from "ramda";
import {S, Maybe, Either} from "../../external/sanctuary/Sanctuary";

const DOMURL = window.URL || (window as any).webkitURL || window;

export const LOADER_TYPE_IMAGE = "image";

export enum LoaderImageType {
    URL = "url",
}

export interface LoaderImageRequest {
    url: string;
    __loaderType:string;
}

export interface LoaderImageResponse {
    img?: HTMLImageElement;
    errorEvt?:Event;
    __loaderType:string;
}


//Nothing means it's loading, Left/Right means error/success
export type LoaderImageStatus = Maybe<LoaderImageResponse> | Either<LoaderImageResponse>;

export type LoaderImageCallback = (resp:Either<LoaderImageResponse>) => void;

//this class is expected to be polled (or callback)
//use loadImage for Promise style
export class LoaderImage {
    private _status: Either<LoaderImageResponse>;
    public __loaderType = LOADER_TYPE_IMAGE;
    
    constructor(_req:Partial<LoaderImageRequest>, callbackAfterLoad?:LoaderImageCallback) {
        const req = {
            ..._req,
            __loaderType: LOADER_TYPE_IMAGE
        }
        const img = new Image();

        
        img.addEventListener("load", evt => {
            this._status = S.Right({
                img: img,
                __loaderType: LOADER_TYPE_IMAGE
            });

            if(callbackAfterLoad !== undefined) {
                callbackAfterLoad(this._status);
            }
        });

        img.addEventListener("error", evt => {
            console.error(evt);
            this._status = S.Left({
                errorEvt: evt
            })
        });

        if(!sameOrigin(req.url)) {
            img.crossOrigin = "anonymous";
        }
        img.src = req.url;
        
        
    }

    public get status():LoaderImageStatus {
        return R.isNil(this._status)
            ? S.Nothing
            : this._status
    }
}

export const loadImagePromise = (_req:Partial<LoaderImageRequest>):Promise<Either<LoaderImageResponse>> =>
    new Promise<Either<LoaderImageResponse>>(resolve => new LoaderImage(_req, resolve));

export const loadImageFactory = (req:Partial<LoaderImageRequest>, callback?:LoaderImageCallback):LoaderImage => new LoaderImage(req, callback)

export const isLoaderImage = (arg:any): arg is LoaderImage => 
    arg.__loaderType === LOADER_TYPE_IMAGE;
    