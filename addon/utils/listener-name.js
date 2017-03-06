import ekbListenerName from 'ember-keyboard/utils/listener-name';

export default function listenerName(/* name, keys */) {
  return ekbListenerName(...arguments).replace(':_all', '');
}
