import {LoaderImage, LoaderImageStatus, LoaderImageRequest, LoaderImageResponse} from "./Loaders-Image";
import {createSimpleTextureFromTarget, WebGlTextureOptions} from "../webgl/WebGl-Textures";
import * as R from "ramda";
import {S, Maybe, Either} from "../../external/sanctuary/Sanctuary";

export type LoaderTextureRequest = LoaderImageRequest & WebGlTextureOptions

export interface LoaderTextureResponse extends LoaderImageResponse {
    texture: WebGLTexture;
}

export const LOADER_TYPE_TEXTURE = "texture";

export type LoaderTextureStatus = Maybe<LoaderTextureResponse> | Either<LoaderTextureResponse>;

export type LoaderTextureCallback = (resp:Either<LoaderTextureResponse>) => void;

//use loadTexture for promise-version, this one is meant to be callback/polled
export class LoaderTexture {
    private _status:Either<LoaderTextureResponse>;
    public __loaderType = LOADER_TYPE_TEXTURE;
    
    constructor(_req:Partial<LoaderTextureRequest>, callbackAfterLoad?:LoaderTextureCallback) {
        const req = Object.assign({}, _req, {__loaderType: LOADER_TYPE_TEXTURE})

        const ldr = new LoaderImage(req, imgResp => {

            this._status = imgResp.isLeft
                ? S.Left({ //TODO: change this to map or chain, convert to Right first then to left
                        __loaderType: LOADER_TYPE_TEXTURE,
                        errorEvt: imgResp.value.errorEvt
                    })
                : S.map(imgResp => ({
                        img: imgResp.img,
                        texture: createSimpleTextureFromTarget (req as LoaderTextureRequest) (imgResp.img),
                        __loaderType: LOADER_TYPE_TEXTURE
                    })) 
                    (imgResp)

            if(callbackAfterLoad !== undefined) {
                callbackAfterLoad(this._status);
            }
        })
    }

    public get status():LoaderTextureStatus {
        return R.isNil(this._status)
            ? S.Nothing
            : this._status
    }
}


export const loadTexturePromise = (req:Partial<LoaderTextureRequest>):Promise<Either<LoaderTextureResponse>> =>
    new Promise<Either<LoaderTextureResponse>>(resolve => new LoaderTexture(req, resolve));

export const loadTextureFactory = (req:Partial<LoaderTextureRequest>, callback?:LoaderTextureCallback):LoaderTexture => new LoaderTexture(req, callback)

export const isLoaderTexture = (arg:any): arg is LoaderTexture => 
    arg.__loaderType === LOADER_TYPE_TEXTURE;

