export const sameOrigin = (url:string):boolean =>
    (new URL(url).origin === window.location.origin);