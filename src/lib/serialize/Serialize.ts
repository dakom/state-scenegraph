export interface Serializer {
    serialize: (props:any) => Uint8Array;
    parse: (bytes:Uint8Array) => any;
}
export type Serializers = Map<string,Serializer>;

export const createSerializerMap = () => new Map<string, Serializer>();