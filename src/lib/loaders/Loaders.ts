import { LoaderImage, LoaderImageRequest, LoaderImageCallback, LoaderImageResponse } from './Loaders-Image';
import { LoaderTexture, LoaderTextureRequest, LoaderTextureCallback, LoaderTextureResponse } from './Loaders-Texture';
import { LoaderXhr, LoaderXhrRequest, LoaderXhrCallback, LoaderXhrResponse } from './Loaders-Xhr';

export * from "./Loaders-Image";
export * from "./Loaders-Xhr";
export * from "./Loaders-Texture";

//Sodium wrappers around loaders/*
export type LoaderRequestAny = Partial<LoaderXhrRequest> | Partial<LoaderImageRequest> | Partial<LoaderTextureRequest>;
export type LoaderResponseAny = LoaderXhrResponse | LoaderImageResponse | LoaderTextureResponse;
export type LoaderCallbackAny = LoaderXhrCallback | LoaderImageCallback | LoaderTextureCallback;
export type LoaderAny = LoaderXhr | LoaderImage | LoaderTexture;