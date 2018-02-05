import { createQuat, createElement, createLocalTransform, getScreenSize, Transform, updateStateWorldTransforms } from '../../lib/Drift';
import { quat } from 'gl-matrix';


const QUAD_SIZE_1 = 400;
const QUAD_SIZE_2 = 200;
const QUAD_SIZE_3 = 80;
const QUAD_SIZE_4 = 40;

const stageSize = getScreenSize();

const createTransformProps = (t: Partial<Transform>) => (rotAngle: number) => {
    const rot = quat.fromEuler(createQuat() as any, 0, 0, rotAngle);
    return {
        transform: createLocalTransform(Object.assign({}, t, {
            rotX: rot[0],
            rotY: rot[1],
            rotZ: rot[2],
            rotW: rot[3]
        }))
    }
}

export const initialState = updateStateWorldTransforms(
    <state firstDraw={true}>
        <controller />
        <camera >
            <quads>
                <quad
                    interactive={true}
                    {...createTransformProps({
                        posX: (stageSize.width - QUAD_SIZE_1) / 2,
                        posY: (stageSize.height - QUAD_SIZE_1) / 2,
                        originX: QUAD_SIZE_1 / 2,
                        originY: QUAD_SIZE_1 / 2
                    })
                        (45)
                    }
                    width={QUAD_SIZE_1}
                    height={QUAD_SIZE_1}
                    color={Float64Array.from([1.0, 0.0, 0.0, 1.0])}
                >
                    <quad
                        interactive={true}
                        {...createTransformProps({
                            posX: 100,
                            posY: 0,
                            originX: QUAD_SIZE_2 / 2,
                            originY: QUAD_SIZE_2 / 2,
                        })
                            (-45)
                        }
                        width={QUAD_SIZE_2}
                        height={QUAD_SIZE_2}
                        color={Float64Array.from([0.0, 1.0, 1.0, 1.0])}
                    />

                    <quad
                        {...createTransformProps({
                            posX: (QUAD_SIZE_1 - QUAD_SIZE_2) / 2,
                            posY: (QUAD_SIZE_1 - QUAD_SIZE_2) / 2,
                            originX: QUAD_SIZE_2 / 2,
                            originY: QUAD_SIZE_2 / 2,
                        })
                            (45)
                        }
                        width={QUAD_SIZE_2}
                        height={QUAD_SIZE_2}
                        color={Float64Array.from([0.0, 1.0, 0.0, 1.0])}
                    >
                        <quad
                            interactive={true}
                            {...createTransformProps({
                                posX: (QUAD_SIZE_2 - QUAD_SIZE_3) / 2,
                                posY: (QUAD_SIZE_2 - QUAD_SIZE_3) / 2,
                                originX: QUAD_SIZE_3 / 2,
                                originY: QUAD_SIZE_3 / 2,
                            })
                                (45)
                            }
                            width={QUAD_SIZE_3}
                            height={QUAD_SIZE_3}
                            color={Float64Array.from([0.0, 0.0, 1.0, 1.0])}
                        >
                            <quad
                                {...createTransformProps({
                                    posX: 0,
                                    posY: 0,
                                    originX: QUAD_SIZE_4 / 2,
                                    originY: QUAD_SIZE_4 / 2,
                                })
                                    (90)
                                }
                                width={QUAD_SIZE_4}
                                height={QUAD_SIZE_4}
                                color={Float64Array.from([1.0, 1.0, 0.0, 1.0])}
                            />
                        </quad>
                    </quad>
                </quad>
            </quads>
        </camera>
    </state>
)