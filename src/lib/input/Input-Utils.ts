import * as R from "ramda";

const hasTouches = R.hasIn("touches"); //we need to check the whole chain

export const isTouchEvent = (evt: MouseEvent | TouchEvent): evt is TouchEvent => hasTouches(evt);

export const getClientCoordsFromPointerEvent = (evt: MouseEvent | TouchEvent): { x: number, y: number } => 
    isTouchEvent(evt)
        ?   evt.touches.length 
            ?   ({
                    x: evt.touches[0].clientX,
                    y: evt.touches[0].clientY,
                })
            :   ({
                    x: NaN,
                    y: NaN,
                })
        :   ({
                x: evt.clientX,
                y: evt.clientY
            });

export const getPointerCoordsFromDomElement = (element) => (evt: MouseEvent | TouchEvent): { x: number, y: number } => {
    
    const rect = element.getBoundingClientRect();
    const clientCoords = getClientCoordsFromPointerEvent(evt);

    return {
        x: clientCoords.x,// - rect.left,
        y: rect.height-clientCoords.y// - rect.top
    }
}

//found online... seems to take into account nested divs and scrolling and things
/*
const getCoords = (canvas) => (evt: MouseEvent): { x: number, y: number } => {
    let x, y, top = 0, left = 0, obj = canvas;
    while (obj && obj.tagName !== 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    left += window.pageXOffset;
    top -= window.pageYOffset;
    // return relative mouse position
    return {
        x: evt.clientX - left,
        y: canvas.height - (evt.clientY - top)
    }
}
*/