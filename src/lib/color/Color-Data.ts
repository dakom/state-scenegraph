import {padLeftDigits2} from "../string/String-Utils";
import {NumberArray} from "../array/Array";
import {createMat4} from "../matrix/Matrix";
import {createVec3, createVec4} from  "../vector/Vector";

const paddedHexString = num => padLeftDigits2((num | 0).toString(16));

export const rgbFromColorIndex = (colorIndex:number):NumberArray =>
    [
        (((colorIndex) >>> 16) & 0xFF) / 0xFF,
        (((colorIndex) >>> 8) & 0xFF) / 0xFF,
        ((colorIndex) & 0xFF) / 0xFF
    ]

export const rgbToColorIndex = (rgb:NumberArray):number =>
    ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]);

export class ColorRGBA {
    public readonly elements:NumberArray;

    constructor(values?:NumberArray) {
        this.elements = (values === undefined) ? createVec4() : values;
    }

    //static methods
    public static fromNumber = (n:number):ColorRGBA =>
        new ColorRGBA([
            (((n) >>> 24) & 0xFF) / 0xFF,
            (((n) >>> 16) & 0xFF) / 0xFF,
            (((n) >>> 8) & 0xFF) / 0xFF,
            ((n) & 0xFF) / 0xFF,
        ]);
    
    public static fromString = (s:string):ColorRGBA =>
        ColorRGBA.fromNumber(parseInt(s, 16));

    //instance methods
    public toString = ():string =>
        paddedHexString(this.r * 0xFF) + paddedHexString(this.g * 0xFF) + paddedHexString(this.b * 0xFF) + paddedHexString(this.a * 0xFF);

    public toNumber = ():number =>
        parseInt(this.toString(), 16);

    //getter/setters
    public get r():number {
        return this.elements[0];
    }
    public set r(val:number) {
        this.elements[0] = val;
    }

    public get g():number {
        return this.elements[1];
    }
    public set g(val:number) {
        this.elements[1] = val;
    }

    public get b():number {
        return this.elements[2];
    }
    public set b(val:number) {
        this.elements[2] = val;
    }

    public get a():number {
        return this.elements[3];
    }
    public set a(val:number) {
        this.elements[3] = val;
    }
}


export class ColorRGB {
    public readonly elements:NumberArray;

    constructor(values?:NumberArray) {
        this.elements = (values === undefined) ? createVec3() : values;
    }

    //static methods
    public static fromNumber = (n:number):ColorRGB =>
        new ColorRGB([
            (((n) >>> 16) & 0xFF) / 0xFF,
            (((n) >>> 8) & 0xFF) / 0xFF,
            ((n) & 0xFF) / 0xFF,
        ]);
    
    public static fromString = (s:string):ColorRGB =>
        ColorRGB.fromNumber(parseInt(s, 16));

    //instance methods
    public toString = ():string =>
        paddedHexString(this.r * 0xFF) + paddedHexString(this.g * 0xFF) + paddedHexString(this.b * 0xFF);

    public toNumber = ():number =>
        parseInt(this.toString(), 16);

    //getter/setters
    public get r():number {
        return this.elements[0];
    }
    public set r(val:number) {
        this.elements[0] = val;
    }

    public get g():number {
        return this.elements[1];
    }
    public set g(val:number) {
        this.elements[1] = val;
    }

    public get b():number {
        return this.elements[2];
    }
    public set b(val:number) {
        this.elements[2] = val;
    }
}

    

