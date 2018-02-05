import { flatbuffers } from 'flatbuffers';
import * as L from 'partial.lenses';
import * as R from 'ramda';

import { S } from '../../external/sanctuary/Sanctuary';
import { State } from '../../flatbuffers/Flatbuffers';
import { parseInputEvent, serializeInputEvent } from '../input/Input-Serialize';
import { ParseTransform, SerializeTransform } from '../transform/Transform';
import { Serializers, Serializer } from '../serialize/Serialize';
import { StateElement } from './State-Elements';
import {lTransform} from "./State-Transform";
import {CHILDREN, PROPS} from "./State-Accessors";
import {createElement} from "./State-Elements";

const loggerForMissingSerializers = {};

export const serializeAppStateToBinary = (logMissingSerializers:boolean) => (propSerializers:Serializers) => (elTree:StateElement):Uint8Array => {
    const builder = new flatbuffers.Builder(1024);

    const _constructNode = lens => {
        const el:StateElement = L.get(lens) (elTree);

    
        const tLens = L.compose([lens, lTransform]);
        
        const elPropsLens = L.compose([lens, PROPS]);

        const typePtr = builder.createString(el.type);

        const hasSerializer = propSerializers.has(el.type);

        if(!hasSerializer && logMissingSerializers) {
            if(!loggerForMissingSerializers.hasOwnProperty(el.type)) {
                loggerForMissingSerializers[el.type] = true;
                console.log(`No serializer for ${el.type}`);
            }
            
        }

            /*
        if(L.isDefined(rLens) (elTree) && !R.isNil (L.get(rLens) (elTree))) {
            console.log(L.get(rLens) (elTree))   
        }
        */

        const transformPtr = L.isDefined(tLens) (elTree) && !R.isNil (L.get(tLens) (elTree))
            ? S.Just(SerializeTransform(builder) (L.get(tLens) (elTree)))
            : S.Nothing;

        const propsPtr = 
            hasSerializer && L.isDefined(elPropsLens) (elTree) && !R.isNil (L.get(elPropsLens) (elTree))
                ? S.Just(State.Element.createPropsVector(builder, propSerializers.get(el.type).serialize (L.get(elPropsLens) (elTree))))
                : S.Nothing;

        const childrenPtrs = 
            R.isNil(el.children)
                ? S.Nothing
                : S.Just
                    (
                        el.isChildText
                        ?   [builder.createString(el.children[0])]
                        :   Array.isArray(el.children)
                                ? el.children
                                    .map((child, i) => L.compose([lens, CHILDREN, i]))
                                    .map(_constructNode)
                                :   [_constructNode(L.compose([lens, CHILDREN]))]
                    )
       
        return {
            type: typePtr,
            props: propsPtr,
            children: childrenPtrs,
            transform: transformPtr,
            isChildText: el.isChildText
        }
    }

    const _writeNode = nodeData  => asText => {
        if(asText) {
            State.Element.startElement(builder);
            State.Element.addText(builder, nodeData);
            return State.Element.endElement(builder);
        }

        const { type, props, children, transform,isChildText} = nodeData;

        const childrenPtr =
            S.map
                (cPtrs => 
                    State.Element.createChildrenVector(builder, cPtrs.map(c => _writeNode(c) (isChildText))))
                (children);

        State.Element.startElement(builder);
        State.Element.addChildIsText(builder, isChildText);
        State.Element.addTypeId(builder, type);

        S.map
            (p => State.Element.addProps(builder, p))
            (props)
        S.map
            (c => State.Element.addChildren(builder, c))
            (childrenPtr)
        S.map
            (t => State.Element.addTransform(builder, t))
            (transform)
            
        return State.Element.endElement(builder);
    }

    _writeNode(_constructNode(L.identity)) (false);
    return builder.asUint8Array();

}

export const parseStateFromBinary = (serializers:Serializers) => (bytes:Uint8Array):StateElement => {
    const parseElement = (data:State.Element) => {
        
        const mapChildren = () => {
            let acc = [];
            for(let i = 0; i < data.childrenLength(); i++) {
                acc[i] = parseElement(data.children(i));
            }
            return acc;
        }
       
        const dataType = data.typeId();

        const props = data.propsLength() 
            ? serializers.has(dataType)
                ?   serializers.get(dataType).parse (data.propsArray())
                :   {}
            : {};

        if(!R.isNil(data.transform())) {
            props["transform"] = ParseTransform(data.transform())
        }
        
        return createElement(
            dataType, 
            props,
            data.childrenLength()
                    ? data.childIsText() 
                        ?   data.children(0).text()
                        :   mapChildren()
                    : null,
        )   
    }

    return parseElement(State.Element.getRootAsElement(new flatbuffers.ByteBuffer(bytes)))
}
