const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

try {
  const { TransformStream, ReadableStream, WritableStream } = require('node:stream/web');
  if (typeof global.TransformStream === 'undefined') global.TransformStream = TransformStream;
  if (typeof global.ReadableStream === 'undefined') global.ReadableStream = ReadableStream;
  if (typeof global.WritableStream === 'undefined') global.WritableStream = WritableStream;
} catch (e) {
  const { TransformStream, ReadableStream, WritableStream } =
    require('web-streams-polyfill/ponyfill');
  if (typeof global.TransformStream === 'undefined') global.TransformStream = TransformStream;
  if (typeof global.ReadableStream === 'undefined') global.ReadableStream = ReadableStream;
  if (typeof global.WritableStream === 'undefined') global.WritableStream = WritableStream;
}
