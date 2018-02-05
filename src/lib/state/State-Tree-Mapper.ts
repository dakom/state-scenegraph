import * as L from 'partial.lenses';
import * as R from 'ramda';

import { StateElement } from './State-Elements';

export type ElementMapper = (el:StateElement) => StateElement;
export type PropsMapper = (el:StateElement) => any;
export type ElementCaller = (el:StateElement) => void;
export type ElementCallerWithPath = ([el, cPath]:[StateElement, Array<number>]) => void;

export const stateElementForEach = (fn:ElementCaller) => (elTree:StateElement):void => {
    const _callElements = (el:StateElement) => {

        fn(el);

        if(el.children !== null) {
            if(Array.isArray(el.children)) {
                el.children.map(_callElements);
            } else {
                _callElements(el.children);
            }
        }
    }

    _callElements(elTree);
}

export const stateElementForEachWithPath = (fn:ElementCallerWithPath) => (elTree:StateElement):void => {
    const _callElements = ([el, cPath]:[StateElement, Array<number>]) => {

        fn([el, cPath]);

        if(el.children !== null) {
            if(Array.isArray(el.children)) {
                el.children.map((el, index) => _callElements([el, cPath.concat(index)]));
            } else {
                _callElements([el.children, cPath.concat([0])]);
            }
        }
    }

    _callElements([elTree, []]);
}

export const stateElementMap = (mapFn:ElementMapper) => (elTree:StateElement):StateElement => {
    
    const _mapElementTree = (el:StateElement) => {
        const children = 
            R.isNil(el.children)
                ? null
                : Array.isArray(el.children)
                    ? el.children.map(_mapElementTree)
                    : _mapElementTree(el.children);

        return L.set("children") (children) (mapFn(el))
    }

    return _mapElementTree (elTree)
}


export const stateElementPropsMap = (mapFn:PropsMapper) => (elTree:StateElement):StateElement => {
    
    const _mapPropsTree = (el:StateElement) => {
        const children = 
            R.isNil(el.children)
                ? null
                : Array.isArray(el.children)
                    ? el.children.map(_mapPropsTree)
                    : _mapPropsTree(el.children);

        return L.isDefined("type") (el)
            ?   L.set("props") ( el.props === null ? null : mapFn(el)) 
                    (L.set("children") (children) (el))
            :   el;
    }

    return _mapPropsTree (elTree)
}