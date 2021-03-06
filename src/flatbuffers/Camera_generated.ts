// automatically generated by the FlatBuffers compiler, do not modify

import { flatbuffers } from "flatbuffers"
import * as NS1812855692714688431 from "./Matrix4_generated";
/**
 * @constructor
 */
export namespace Camera{
export class Props {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer;

  /**
   * @type {number}
   */
  bb_pos:number = 0;
/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Props}
 */
__init(i:number, bb:flatbuffers.ByteBuffer):Props {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Props=} obj
 * @returns {Props}
 */
static getRootAsProps(bb:flatbuffers.ByteBuffer, obj?:Props):Props {
  return (obj || new Props).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {Matrix4.Values=} obj
 * @returns {Matrix4.Values|null}
 */
projection(obj?:NS1812855692714688431.Matrix4.Values):NS1812855692714688431.Matrix4.Values|null {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? (obj || new NS1812855692714688431.Matrix4.Values).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
};

/**
 * @param {Matrix4.Values=} obj
 * @returns {Matrix4.Values|null}
 */
eye(obj?:NS1812855692714688431.Matrix4.Values):NS1812855692714688431.Matrix4.Values|null {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? (obj || new NS1812855692714688431.Matrix4.Values).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
};

/**
 * @param {Matrix4.Values=} obj
 * @returns {Matrix4.Values|null}
 */
matrix(obj?:NS1812855692714688431.Matrix4.Values):NS1812855692714688431.Matrix4.Values|null {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? (obj || new NS1812855692714688431.Matrix4.Values).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
static startProps(builder:flatbuffers.Builder) {
  builder.startObject(3);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} projectionOffset
 */
static addProjection(builder:flatbuffers.Builder, projectionOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, projectionOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} eyeOffset
 */
static addEye(builder:flatbuffers.Builder, eyeOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, eyeOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} matrixOffset
 */
static addMatrix(builder:flatbuffers.Builder, matrixOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, matrixOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
static endProps(builder:flatbuffers.Builder):flatbuffers.Offset {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
static finishPropsBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
};

}
}
