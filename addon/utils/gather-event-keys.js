import modifiers from 'ember-keyboard/fixtures/modifiers-array';

export default function gatherEventKeys(event) {
  return modifiers.reduce((keys, keyName) => {
    if (event && event[`${keyName}Key`]) {
      keys.push(keyName);
    }
    return keys;
  }, []);
}
