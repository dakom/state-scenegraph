export type NumberArray = Array<number> | Float64Array | Float32Array | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array;

export const AssignValueFloat64 = (data:Float64Array) => (index:number) => (value:number):Float64Array => {
    const ALLOCATE_AMOUNT = 10;

    
    if(index >= data.length) {
        const newData = new Float64Array(data.length + ALLOCATE_AMOUNT);
        newData.set(data);
        data = newData;
    }

    data[index] = value;
    return data;
}