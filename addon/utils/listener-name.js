import translateCmdKey from 'ember-evented-tasks/utils/translate-cmd-key';

function sortedKeys(keyArray) {
  return keyArray.sort().join('+');
}

export default function listenerName(type, keyArray = []) {
  if (keyArray.includes('cmd')) {
    keyArray[keyArray.indexOf('cmd')] = translateCmdKey();
  }

  let keys = keyArray.length === 0 ? '' : sortedKeys(keyArray);

  return `${type}:${keys}`;
}
