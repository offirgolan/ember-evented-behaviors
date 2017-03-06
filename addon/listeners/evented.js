import Ember from 'ember';
import listenerName from 'ember-evented-tasks/utils/listener-name';
import modifiers from 'ember-evented-tasks/fixtures/modifiers-array';

const {
  isEmpty,
  Logger
} = Ember;

function validateKeys(keys = []) {
  keys.forEach((key) => {
    if (modifiers.indexOf(key) === -1) {
      Logger.error(`\`${key}\` is not a valid key name`);
    }
  });
}

function formattedListener(type, keysString) {
  let keys = isEmpty(keysString) ? [] : keysString.split('+');

  validateKeys(keys);

  return listenerName(type, keys);
}

export function onEvent(eventName, keysString = '') {
  return formattedListener(`onEvent:${eventName}`, keysString);
}
