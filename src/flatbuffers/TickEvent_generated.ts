// automatically generated by the FlatBuffers compiler, do not modify

import { flatbuffers } from "flatbuffers"
/**
 * @constructor
 */
export namespace Tick{
export class Event {
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
 * @returns {Event}
 */
__init(i:number, bb:flatbuffers.ByteBuffer):Event {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Event=} obj
 * @returns {Event}
 */
static getRootAsEvent(bb:flatbuffers.ByteBuffer, obj?:Event):Event {
  return (obj || new Event).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {number}
 */
frameTs():number {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
dt():number {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
static startEvent(builder:flatbuffers.Builder) {
  builder.startObject(2);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} frameTs
 */
static addFrameTs(builder:flatbuffers.Builder, frameTs:number) {
  builder.addFieldFloat64(0, frameTs, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} dt
 */
static addDt(builder:flatbuffers.Builder, dt:number) {
  builder.addFieldFloat64(1, dt, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
static endEvent(builder:flatbuffers.Builder):flatbuffers.Offset {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
static finishEventBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
};

}
}
