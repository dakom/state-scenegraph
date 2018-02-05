// automatically generated by the FlatBuffers compiler, do not modify

import { flatbuffers } from "flatbuffers"
/**
 * @constructor
 */
export namespace Keyboard{
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
status():number {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
key():string|null
key(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
key(optionalEncoding?:any):string|Uint8Array|null {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
static startEvent(builder:flatbuffers.Builder) {
  builder.startObject(2);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} status
 */
static addStatus(builder:flatbuffers.Builder, status:number) {
  builder.addFieldInt32(0, status, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} keyOffset
 */
static addKey(builder:flatbuffers.Builder, keyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, keyOffset, 0);
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