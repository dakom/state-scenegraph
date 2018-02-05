import { mat4, quat, vec3 } from 'gl-matrix';

test('Matrix inverse - no rotation', () => { 
    const m = mat4.fromRotationTranslationScaleOrigin(mat4.create(), 
        quat.fromEuler(quat.create(), 0,0,0), 
        vec3.fromValues(42,0,0), 
        vec3.fromValues(1,1,1), 
        vec3.create()
    );
    const invM = mat4.invert(mat4.create(), m);

    const result = mat4.multiply(mat4.create(), m, invM);
});

test('Matrix inverse - with rotation', () => { 
    const m = mat4.fromRotationTranslationScaleOrigin(mat4.create(), 
        quat.fromEuler(quat.create(), 0,0,45), 
        vec3.fromValues(42,0,0), 
        vec3.fromValues(1,1,1), 
        vec3.create()
    );
    
    const invM = mat4.invert(mat4.create(), m);

    const result = mat4.multiply(mat4.create(), m, invM);
});