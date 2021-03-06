// automatically generated by the FlatBuffers compiler, do not modify

import { flatbuffers } from "flatbuffers"
/**
 * @constructor
 */
export namespace Input{
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
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
sourceId():string|null
sourceId(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
sourceId(optionalEncoding?:any):string|Uint8Array|null {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
schedule():string|null
schedule(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
schedule(optionalEncoding?:any):string|Uint8Array|null {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {number} index
 * @returns {number}
 */
data(index: number):number|null {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
};

/**
 * @returns {number}
 */
dataLength():number {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @returns {Uint8Array}
 */
dataArray():Uint8Array|null {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
};

/**
 * @returns {number}
 */
ts():number {
  var offset = this.bb.__offset(this.bb_pos, 10);
  return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
static startEvent(builder:flatbuffers.Builder) {
  builder.startObject(4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} sourceIdOffset
 */
static addSourceId(builder:flatbuffers.Builder, sourceIdOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, sourceIdOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} scheduleOffset
 */
static addSchedule(builder:flatbuffers.Builder, scheduleOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, scheduleOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} dataOffset
 */
static addData(builder:flatbuffers.Builder, dataOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, dataOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<number>} data
 * @returns {flatbuffers.Offset}
 */
static createDataVector(builder:flatbuffers.Builder, data:number[] | Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (var i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]);
  }
  return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
static startDataVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} ts
 */
static addTs(builder:flatbuffers.Builder, ts:number) {
  builder.addFieldFloat64(3, ts, 0.0);
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
