

import { 
    createElement, 
    appendElement,
    CameraSerializer, getCameraOrthoFullscreen,
    createTransform,
    StateElement,
} from "../../../engine/Exports";



const testRoundtrip = (element) => {
    
    const binary = CameraSerializer.serialize(element.props as any);
    const parsed = CameraSerializer.parse(binary);

    expect(parsed).toEqual(element.props);
}

test('Camera', () => {
    testRoundtrip(<camera {...getCameraOrthoFullscreen({width: 340, height: 720})} />);
});