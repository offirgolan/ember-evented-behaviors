export default function isEventedObject(o) {
  return o &&
         typeof o === 'object' &&
         typeof o.on === 'function' &&
         typeof o.off === 'function';
}
