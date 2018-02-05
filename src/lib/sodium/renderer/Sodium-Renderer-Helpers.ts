import { Stream, StreamSink, Cell } from 'sodiumjs';
import { Maybe, S, Either } from '../../../external/sanctuary/Sanctuary';
import {NumberArray} from "../../array/Array";
import {WebGlElement, setWebGlElementClipSpace} from "../../renderer/Renderer-WebGl";
import {Transform} from "../../transform/Transform";

export const liftWebGlElementCellsClipSpace = 
    (cCamera:Cell<NumberArray>) => (elements:Array<Cell<WebGlElement>>):Cell<Array<WebGlElement>> => 
        S.sequence(Cell) (
            elements.map((cElement:Cell<WebGlElement>) => 
                cElement.lift(cCamera, (element, cameraMatrix) => setWebGlElementClipSpace (cameraMatrix) (element))
        )
    );

export const liftWebGlElementsClipSpace = 
    (cCamera:Cell<NumberArray>) => (elements:Cell<Array<WebGlElement>>):Cell<Array<WebGlElement>> => 
        elements.lift(cCamera, (elements, cameraMatrix) => 
            elements.map(setWebGlElementClipSpace (cameraMatrix))
        );