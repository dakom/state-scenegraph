import * as R from "ramda";
import {S, Maybe} from "../../external/sanctuary/Sanctuary";
import * as L from "partial.lenses";

export interface StateElement {
    type: string,
    props: any,
    children: any;
    isChildText:boolean;
}

export type StateElementLens = Array<string | number>;

export function createElement(type:string, props:any, children:any):StateElement {
    //from https://github.com/facebook/react/blob/45c1ff348e1c7d03567f5bba6cb32cffa9222972/packages/react/src/ReactElement.js
    let childrenLength = arguments.length - 2;
    if (childrenLength > 1) {
      let childArray = Array(childrenLength);
      for (let i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      children = childArray;
    }

    const isValid = !R.isNil(children);
    const isChildArray = isValid && Array.isArray(children);
    const isChildText = isValid && !isChildArray && !R.has("type") (children);
    
   

    if(R.isEmpty(props)) {
        props = null;
    }

    const retObj:StateElement = {
        type: type, 
        props: props,
        children: 
        !isValid
            ? null 
            : isChildArray 
                ? children
                : [children],
        isChildText: isChildText
    }

    return retObj;
}

//Adjustments that require more than simply L.get/L.set
export const appendElement = parentLens => props => (elTree:StateElement) => 
    L.set(L.compose([parentLens, "children", L.append])) (props) (elTree);

//second arg is the props
export const maybePropsToElement = (fn:((props:any) => StateElement)) => S.pipe([
    S.maybeToNullable,
    props => props === null 
        ? null
        : fn(props)
])