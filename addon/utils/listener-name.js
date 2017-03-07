import translateCmdKey from 'ember-evented-tasks/utils/translate-cmd-key';

export default function listenerName(type, keyArray = []) {
  if (keyArray.includes('cmd')) {
    keyArray[keyArray.indexOf('cmd')] = translateCmdKey();
  }

  let keys = keyArray.length === 0 ? '' : keyArray.sort().join('+');

  return `${type}:${keys}`;
}
