import * as L from 'partial.lenses';
import * as R from 'ramda';

import { Maybe } from '../../external/sanctuary/Sanctuary';
import { StateElement } from './State-Elements';

export const PROPS = "props";
export const CHILDREN = "children";
export const TYPE = "type";

export const findLensFrom = (predicate:((el:any) => boolean)) => (startingLens) => (elTree:StateElement) => {
    const _dig = (lens) => {
        const el:StateElement = L.get(lens) (elTree);

        if(predicate(el)) {
            return lens;
        }

        if(!R.isNil(el.children)) {
            if(Array.isArray(el.children)) {
                for(let i = 0; i < el.children.length; i++) {
                    const cLens = L.compose([lens, CHILDREN, i]);
                    const result = _dig (cLens);
                    if(!R.isNil(result)) {
                        return result;
                    }
                }
            } else {
                const cLens = L.compose([lens, CHILDREN]);
                const result = _dig (cLens);
                if(!R.isNil(result)) {
                    return result;
                }
            }
            
        }
        return undefined;
    }

    return _dig (startingLens)
}

export const findLens = (predicate:((el:any) => boolean)) => (elTree:StateElement) =>
    findLensFrom (predicate) (L.identity) (elTree);

export const findLensByTypeFrom = (type:string) => startingLens => (elTree:StateElement) =>
    findLensFrom (el => el.type === type) (startingLens) (elTree);

export const findLensByType = (type:string) => (elTree:StateElement):Maybe<any> =>
    findLensByTypeFrom (type) (L.identity) (elTree);

//Getting lens by specifycing a path = e.g. ["foo", "bar", 0, 1]
//Requires the target because getting a child by type is a search
export const lensPath = (xs:Array<string | number>) => (elTree:StateElement) =>
    xs.reduce((acc, val) => 
        (typeof val === "string")
            ?   findLensByTypeFrom (val) (acc) (elTree)
            :   L.compose(acc, CHILDREN, val)
        , L.identity);

//like lensPath but only for children - faster and doesn't require the state to search
export const childLensPath = (xs:Array<number>) =>
    xs.reduce((acc, val) => 
        (typeof val === "string")
            ?   L.compose(acc, CHILDREN, parseInt(val, 10))
            :   L.compose(acc, CHILDREN, val)
        , L.identity);

export const propsAtChildLensPath = (xs:Array<number>) =>
    L.compose([childLensPath(xs), PROPS]);

export const propsAtLensPath = (xs:Array<number | string>) => (elTree:StateElement) =>
    L.compose([lensPath(xs) (elTree), PROPS]);

export const propLens = (x:string) =>
    L.compose([PROPS, x]);
export const childLens = (x:number) =>
    L.compose([CHILDREN, x]);




