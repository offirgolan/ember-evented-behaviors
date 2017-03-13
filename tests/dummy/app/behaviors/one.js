import Behavior, { onEvent } from 'ember-evented-behaviors';

export default Behavior.extend({
  subscribeEvents() {
    this.subscribe(this.one, onEvent('click'));
  },

  one() {
    console.log('Behavior One: One');
  }
});
