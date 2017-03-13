import Behavior, { onEvent } from 'ember-evented-behaviors';

export default Behavior.extend({
  subscribeEvents() {
    this.subscribe(this.two, onEvent('click'));
  },

  two() {
    console.log('Behavior Two: Two');
  }
});
