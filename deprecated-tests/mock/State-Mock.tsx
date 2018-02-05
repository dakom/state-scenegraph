import {createElement, createTransform} from "../../engine/Exports";

export const createMockHierarchy = () => (
    <_a n="1" d={{ x: "a" }}>
        <_b n="2" d={{ x: "b" }}>
        </_b>
        <_c n="3" d={{ x: "c", "0": "c2" }}>
            <_d n="4" d={{ x: "d" }} />
            <_e n="5" d={{ x: "e" }} />
        </_c>
        <_f n="6" d={{ x: "f" }} >
            <_g n="7" d={{ x: "g" }} />
        </_f>
    </_a>
)

export const createMockScene = () => (
    <scene>
    <balls>
        <ball transform={createTransform({posX: 25})} velocity={{x: 20, y: 30}}>
            <quad   
                transform={createTransform({posX: 25})} 
                width={400}
                height={400}
                color={NumberArray.from([1.0, 0.0, 0.0, 1.0])}
            />
        </ball>

        <ball transform={createTransform({posX: 40})} velocity={{x: 20, y: 30}} >
            <quad   
                transform={createTransform({posX: 2})} 
                width={400}
                height={400}
                color={NumberArray.from([1.0, 0.0, 0.0, 1.0])}
            />
        </ball>
    </balls>
</scene>
)

export const createMockState = () => (
    <state>
        <io 
                    stageSize=
                        {{
                            width: 200,
                            height: 400
                        }}
                    
                    deltaTime=
                        {
                            42
                        }
                    
                    event=
                        {{
                            sourceId: "someEvent"
                        }}
                    
                    ts=
                        {
                            70
                        }
                />
        {createMockScene()}
    </state>
)



