// automatically generated by the FlatBuffers compiler, do not modify

import { flatbuffers } from "flatbuffers"
/**
 * @constructor
 */
export namespace Matrix4{
export class Values {
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
 * @returns {Values}
 */
__init(i:number, bb:flatbuffers.ByteBuffer):Values {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Values=} obj
 * @returns {Values}
 */
static getRootAsValues(bb:flatbuffers.ByteBuffer, obj?:Values):Values {
  return (obj || new Values).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {number}
 */
a():number {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
b():number {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
c():number {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
d():number {
  var offset = this.bb.__offset(this.bb_pos, 10);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
e():number {
  var offset = this.bb.__offset(this.bb_pos, 12);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
f():number {
  var offset = this.bb.__offset(this.bb_pos, 14);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
g():number {
  var offset = this.bb.__offset(this.bb_pos, 16);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
h():number {
  var offset = this.bb.__offset(this.bb_pos, 18);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
i():number {
  var offset = this.bb.__offset(this.bb_pos, 20);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
j():number {
  var offset = this.bb.__offset(this.bb_pos, 22);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
k():number {
  var offset = this.bb.__offset(this.bb_pos, 24);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
l():number {
  var offset = this.bb.__offset(this.bb_pos, 26);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
m():number {
  var offset = this.bb.__offset(this.bb_pos, 28);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
n():number {
  var offset = this.bb.__offset(this.bb_pos, 30);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
o():number {
  var offset = this.bb.__offset(this.bb_pos, 32);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
p():number {
  var offset = this.bb.__offset(this.bb_pos, 34);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
static startValues(builder:flatbuffers.Builder) {
  builder.startObject(16);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} a
 */
static addA(builder:flatbuffers.Builder, a:number) {
  builder.addFieldFloat64(0, a, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} b
 */
static addB(builder:flatbuffers.Builder, b:number) {
  builder.addFieldFloat64(1, b, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} c
 */
static addC(builder:flatbuffers.Builder, c:number) {
  builder.addFieldFloat64(2, c, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} d
 */
static addD(builder:flatbuffers.Builder, d:number) {
  builder.addFieldFloat64(3, d, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} e
 */
static addE(builder:flatbuffers.Builder, e:number) {
  builder.addFieldFloat64(4, e, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} f
 */
static addF(builder:flatbuffers.Builder, f:number) {
  builder.addFieldFloat64(5, f, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} g
 */
static addG(builder:flatbuffers.Builder, g:number) {
  builder.addFieldFloat64(6, g, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} h
 */
static addH(builder:flatbuffers.Builder, h:number) {
  builder.addFieldFloat64(7, h, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} i
 */
static addI(builder:flatbuffers.Builder, i:number) {
  builder.addFieldFloat64(8, i, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} j
 */
static addJ(builder:flatbuffers.Builder, j:number) {
  builder.addFieldFloat64(9, j, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} k
 */
static addK(builder:flatbuffers.Builder, k:number) {
  builder.addFieldFloat64(10, k, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} l
 */
static addL(builder:flatbuffers.Builder, l:number) {
  builder.addFieldFloat64(11, l, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} m
 */
static addM(builder:flatbuffers.Builder, m:number) {
  builder.addFieldFloat64(12, m, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} n
 */
static addN(builder:flatbuffers.Builder, n:number) {
  builder.addFieldFloat64(13, n, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} o
 */
static addO(builder:flatbuffers.Builder, o:number) {
  builder.addFieldFloat64(14, o, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} p
 */
static addP(builder:flatbuffers.Builder, p:number) {
  builder.addFieldFloat64(15, p, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
static endValues(builder:flatbuffers.Builder):flatbuffers.Offset {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
static finishValuesBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
};

}
}
