import Ember from 'ember';
import Behavior, { onEvent } from 'ember-evented-behaviors';

export default Behavior.extend({
  subscribeEvents() {
    this.register('onShiftClick', onEvent('click', 'shift'));
  },

  onShiftClick(/* context, event */) {
    // Do something on shift + click
  }
});
