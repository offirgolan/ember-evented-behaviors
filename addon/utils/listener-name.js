import ekbListenerName from 'ember-keyboard/utils/listener-name';

function gatherKeys(event) {
 return ['alt', 'ctrl', 'meta', 'shift'].reduce((keys, keyName) => {
    if (event && event[`${keyName}Key`]) {
      keys.push(keyName);
    }
    return keys;
  }, []);
}

export function listenerName(type, event) {
  return ekbListenerName(type, gatherKeys(event));
}
