import * as L from 'partial.lenses';
import * as R from 'ramda';

import { StateElementLens, StateElement } from './State-Elements';
import { CHILDREN } from './State-Accessors';

export const logState = (elTree:StateElement) => {
    const buildup = [];

    const _log = (lens:StateElementLens) => {
        
        const el:StateElement = L.get(lens) (elTree);
        
        const refPath = lens.filter(l => l !== "children");

        buildup.push(`${el.type} ${JSON.stringify(refPath)}`);
        
        if(!R.isNil(el.children)) {
            if(Array.isArray(el.children)) {
                for(let i = 0; i < el.children.length; i++) {
                    _log (lens.concat([CHILDREN, i]))
                }
            } else {
                _log (lens.concat([CHILDREN]))
            }
        }
    }

    _log ([]);

    console.log(buildup);
    
    return elTree;
}