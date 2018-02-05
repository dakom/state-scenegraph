import { flatbuffers } from 'flatbuffers';
import { Camera as CameraData} from '../../flatbuffers/Camera_generated';
import { Camera } from './Camera-Utils';
import { ParseMatrix4, SerializeMatrix4 } from '../matrix/Matrix';

export const SerializeCamera =  (builder) => (props: Camera): number => {

    //Prep non-scalar data
    const projectionPtr = SerializeMatrix4(builder) (props.projection);
    const eyePtr = SerializeMatrix4(builder) (props.eye);
    const matrixPtr = SerializeMatrix4(builder)(props.matrix);

    //Serialize everything
    CameraData.Props.startProps(builder);
    CameraData.Props.addProjection(builder, projectionPtr);
    CameraData.Props.addEye(builder, eyePtr);
    CameraData.Props.addMatrix(builder, matrixPtr);
    return CameraData.Props.endProps(builder);

}

export const SerializeCameraToBinary = (props: Camera): Uint8Array => {
    const builder = new flatbuffers.Builder(1024);
    builder.finish(SerializeCamera(builder)(props));

    return builder.asUint8Array();
}


export const ParseCamera = (props:CameraData.Props): Camera => {
    
    return ({
        projection: ParseMatrix4(props.projection()),
        eye: ParseMatrix4(props.eye()),
        matrix: ParseMatrix4(props.matrix()),
    });
}
    

export const ParseCameraFromBinary = (bytes: Uint8Array): Camera =>
    ParseCamera(
        CameraData.Props
            .getRootAsProps(new flatbuffers.ByteBuffer(bytes)));

export const CameraSerializer = {
    serialize: SerializeCameraToBinary,
    parse:  ParseCameraFromBinary
}