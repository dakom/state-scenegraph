import * as R from "ramda";
import {S, Either, Maybe} from "../../external/sanctuary/Sanctuary";

export const LOADER_TYPE_XHR = "xhr";

export enum LoaderXhrResponseType {
    BLOB = "blob",
    ARRAYBUFFER = "arraybuffer",
    DOCUMENT = "document",
    JSON = "json",
    TEXT = "text",
}

export enum LoaderXhrRequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export enum LoaderXhrRequestType {
    PLAIN = "plain",
    FORM = "form",
    MULTIPART = "multipart"
}

export interface LoaderXhrRequest {
    url:string;
    args:any;
    logError:boolean;
    method:LoaderXhrRequestMethod;
    requestType:LoaderXhrRequestType;
    responseType:LoaderXhrResponseType;
    headers?:Array<[string, string]>;
    __loaderType:string
}

export interface LoaderXhrResponse {
    data:any;
    statusCode:number;
    success:boolean;
    __loaderType:string
}


export type LoaderXhrCallback = (resp:Either<LoaderXhrResponse>) => void;

//Nothing means it's loading, Left/Right means error/success
export type LoaderXhrStatus = Maybe<LoaderXhrResponse> | Either<LoaderXhrResponse>;

const fillDefaults = (req:Partial<LoaderXhrRequest>):LoaderXhrRequest => {
    return {
        url: R.isNil(req.url) ? "" : req.url,
        args: R.isNil(req.args) ? null : req.args,
        logError: R.isNil(req.logError) ? true : req.logError,
        method: R.isNil(req.method) ? LoaderXhrRequestMethod.GET : req.method,
        requestType: R.isNil(req.requestType) ? LoaderXhrRequestType.PLAIN : req.requestType,
        responseType: R.isNil(req.responseType) ? LoaderXhrResponseType.ARRAYBUFFER : req.responseType,
        __loaderType: LOADER_TYPE_XHR
    }
}

const requestsEqual = (r1:LoaderXhrRequest) => (r2:LoaderXhrRequest):boolean => {
    const r1Nil = R.isNil(r1);
    const r2Nil = R.isNil(r2);

    if(r1Nil && r2Nil) {
        return true;
    }
    if(r1Nil !== r2Nil) {
        return false;
    }

    return (
        r1.url === r2.url 
        && r1.method === r2.method 
        && r1.requestType === r2.requestType 
        && r1.responseType === r2.responseType
    );
}

//the loader class is expected to be polled (e.g. on tick) - it does not broadcast events
//loadXhr returns a new loader with a Promise
export class LoaderXhr {
    private currentRequest:LoaderXhrRequest;
    private _status:Either<LoaderXhrResponse>;
    private xhr:XMLHttpRequest = null;
    public __loaderType = LOADER_TYPE_XHR;
    
    constructor(_req?:Partial<LoaderXhrRequest>, _callback?:LoaderXhrCallback) {
        if(_req !== undefined) {
            this.load(_req, _callback);
        }
    }

    public load(_req:Partial<LoaderXhrRequest>, _callback?:LoaderXhrCallback):LoaderXhrStatus {
        const req = fillDefaults(_req);

        if(!requestsEqual(this.currentRequest) (req)) {
            this.close();
        }

        this.currentRequest = req;

        if(!R.isNil(this._status)) { 
            //if we got it, return it
            return this._status;
        }

        if(R.isNil(req) || this.xhr !== null) {
            //if request is null, just treat it as "always loading"
            //if the xhr is not null here - it means its still loading from a previous request
            return S.Nothing;
        }

        //otherwise, it's a valid new request

        const xhr = new XMLHttpRequest();
        this.xhr = xhr;

        xhr.onreadystatechange = () => {
            
            if (xhr.readyState === xhr.DONE) {
                if(!xhr.status) {
                    return; //was aborted... this.xhr should actually be null
                }

                const response:Partial<LoaderXhrResponse> = {
                    __loaderType: LOADER_TYPE_XHR
                };

                response.data = req.responseType === LoaderXhrResponseType.TEXT ? xhr.responseText : xhr.response;
                response.statusCode = xhr.status;
                
                if(response.statusCode !== 200) {
                    if(req.logError) {
                        console.error(response);
                    }
                    this._status = S.Left(response);
                } else {
                    this._status = S.Right(response);
                }

                if(!R.isNil(_callback)) {
                    _callback(this._status);
                }
            }
        }

        xhr.open(req.method, req.url);
        xhr.responseType = req.responseType;

        if(_req.headers !== undefined) {
            _req.headers.forEach(([key, val]) => {
                xhr.setRequestHeader(key, val);
            });

            //if we have an inherent jwt - mix it in here?
        };
        
        if (_req.requestType === LoaderXhrRequestType.FORM && _req.args !== null) {
            let requestData = '';

            for (var key in req.args) {

                if (_req.args.hasOwnProperty(key)) {
                    if (requestData !== '') {
                        requestData += '&'
                    }
                    requestData += key + "=" + encodeURIComponent(_req.args[key])
                }
            }

            if (requestData !== '') {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                //Not actually allowed by spec, so commenting out.. browser will calculate automatically
                //xhr.setRequestHeader("Content-length", requestData.length);
                xhr.send(requestData);
            } else {
                xhr.send();
            }

        } else if(_req.requestType === LoaderXhrRequestType.MULTIPART && _req.args !== null) {
            xhr.send(_req.args);
        } else {
            xhr.send();
        }
        
        return this.status;
    }

    public get status():LoaderXhrStatus {
        return R.isNil(this._status)
            ? S.Nothing
            : this._status
    }
    
    public close() {
        if(!R.isNil(this.xhr)) {
            this.xhr.onreadystatechange = null;
            this.xhr.abort();
        }

        this.xhr = null;
        this._status = null;
    }
}

export const loadXhrPromise = (req:Partial<LoaderXhrRequest>):Promise<Either<LoaderXhrResponse>> =>
    new Promise<Either<LoaderXhrResponse>>(resolve => new LoaderXhr(req, resolve));

export const loadXhrFactory = (req:Partial<LoaderXhrRequest>, callback?:LoaderXhrCallback):LoaderXhr => new LoaderXhr(req, callback)

export const isLoaderXhr = (arg:any): arg is LoaderXhr => 
    arg.__loaderType === LOADER_TYPE_XHR;