// automatically generated by the FlatBuffers compiler, do not modify

import { flatbuffers } from "flatbuffers"
import * as NS1812855692714688431 from "./Matrix4_generated";
/**
 * @constructor
 */
export namespace Transform{
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
localSpace(obj?:NS1812855692714688431.Matrix4.Values):NS1812855692714688431.Matrix4.Values|null {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? (obj || new NS1812855692714688431.Matrix4.Values).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
};

/**
 * @param {Matrix4.Values=} obj
 * @returns {Matrix4.Values|null}
 */
worldSpace(obj?:NS1812855692714688431.Matrix4.Values):NS1812855692714688431.Matrix4.Values|null {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? (obj || new NS1812855692714688431.Matrix4.Values).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
};

/**
 * @param {Matrix4.Values=} obj
 * @returns {Matrix4.Values|null}
 */
parentWorldSpace(obj?:NS1812855692714688431.Matrix4.Values):NS1812855692714688431.Matrix4.Values|null {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? (obj || new NS1812855692714688431.Matrix4.Values).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
};

/**
 * @returns {number}
 */
posX():number {
  var offset = this.bb.__offset(this.bb_pos, 10);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
posY():number {
  var offset = this.bb.__offset(this.bb_pos, 12);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
posZ():number {
  var offset = this.bb.__offset(this.bb_pos, 14);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
originX():number {
  var offset = this.bb.__offset(this.bb_pos, 16);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
originY():number {
  var offset = this.bb.__offset(this.bb_pos, 18);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
originZ():number {
  var offset = this.bb.__offset(this.bb_pos, 20);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
scaleX():number {
  var offset = this.bb.__offset(this.bb_pos, 22);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
scaleY():number {
  var offset = this.bb.__offset(this.bb_pos, 24);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
scaleZ():number {
  var offset = this.bb.__offset(this.bb_pos, 26);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
rotX():number {
  var offset = this.bb.__offset(this.bb_pos, 28);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
rotY():number {
  var offset = this.bb.__offset(this.bb_pos, 30);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
rotZ():number {
  var offset = this.bb.__offset(this.bb_pos, 32);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
rotW():number {
  var offset = this.bb.__offset(this.bb_pos, 34);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
static startProps(builder:flatbuffers.Builder) {
  builder.startObject(16);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} localSpaceOffset
 */
static addLocalSpace(builder:flatbuffers.Builder, localSpaceOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, localSpaceOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} worldSpaceOffset
 */
static addWorldSpace(builder:flatbuffers.Builder, worldSpaceOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, worldSpaceOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} parentWorldSpaceOffset
 */
static addParentWorldSpace(builder:flatbuffers.Builder, parentWorldSpaceOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, parentWorldSpaceOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} posX
 */
static addPosX(builder:flatbuffers.Builder, posX:number) {
  builder.addFieldFloat64(3, posX, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} posY
 */
static addPosY(builder:flatbuffers.Builder, posY:number) {
  builder.addFieldFloat64(4, posY, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} posZ
 */
static addPosZ(builder:flatbuffers.Builder, posZ:number) {
  builder.addFieldFloat64(5, posZ, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} originX
 */
static addOriginX(builder:flatbuffers.Builder, originX:number) {
  builder.addFieldFloat64(6, originX, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} originY
 */
static addOriginY(builder:flatbuffers.Builder, originY:number) {
  builder.addFieldFloat64(7, originY, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} originZ
 */
static addOriginZ(builder:flatbuffers.Builder, originZ:number) {
  builder.addFieldFloat64(8, originZ, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} scaleX
 */
static addScaleX(builder:flatbuffers.Builder, scaleX:number) {
  builder.addFieldFloat64(9, scaleX, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} scaleY
 */
static addScaleY(builder:flatbuffers.Builder, scaleY:number) {
  builder.addFieldFloat64(10, scaleY, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} scaleZ
 */
static addScaleZ(builder:flatbuffers.Builder, scaleZ:number) {
  builder.addFieldFloat64(11, scaleZ, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} rotX
 */
static addRotX(builder:flatbuffers.Builder, rotX:number) {
  builder.addFieldFloat64(12, rotX, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} rotY
 */
static addRotY(builder:flatbuffers.Builder, rotY:number) {
  builder.addFieldFloat64(13, rotY, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} rotZ
 */
static addRotZ(builder:flatbuffers.Builder, rotZ:number) {
  builder.addFieldFloat64(14, rotZ, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} rotW
 */
static addRotW(builder:flatbuffers.Builder, rotW:number) {
  builder.addFieldFloat64(15, rotW, 0.0);
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
