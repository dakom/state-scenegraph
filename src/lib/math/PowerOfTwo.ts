export const isPowerOf2 = (value:number):boolean =>
    (value & (value - 1)) == 0;