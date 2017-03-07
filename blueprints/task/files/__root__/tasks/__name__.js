import Ember from 'ember';
import Task, { onEvent } from 'ember-evented-tasks';

export default Task.extend({
  registerEvents() {
    this.register('onShiftClick', onEvent('click', 'shift'));
  },

  onShiftClick(/* context, event */) {
    // Do something on shift + click
  }
});
