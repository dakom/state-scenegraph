import { ColorRGB, ColorRGBA } from '../../../engine/utils/color/Color';

const MAX_COLORS = 100;

const testColorRangesRGBA = ():boolean => {
    const testNumber = (n) => 
        ColorRGBA.fromNumber(n).toNumber() === n;

    
    for(let i = 0; i < MAX_COLORS; i++) {
        const n = Math.round(Math.random() * 0xFFFFFFFF);
        if(!testNumber(n)) {
            return false;
        }
    }

    
    return(true);
}

const testColorRangesRGB = ():boolean => {
    const testNumber = (n) => 
        ColorRGB.fromNumber(n).toNumber() === n;

    
    for(let i = 0; i < MAX_COLORS; i++) {
        const n = Math.round(Math.random() * 0xFFFFFF);
        if(!testNumber(n)) {
            return false;
        }
    }

    
    return(true);
}

test('Color Conversion', () => {
    
    expect(testColorRangesRGBA()).toBe(true);

    expect(testColorRangesRGB()).toBe(true);
});
