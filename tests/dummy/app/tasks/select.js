import Ember from 'ember';
import Task from 'ember-evented-tasks';
import { keyDown } from 'ember-keyboard';

const {
  set
} = Ember;

export default Task.extend({
  items: null,

  subscribeEvents() {
    this.subscribe('selectOne', 'onClick');
    this.subscribe('selectOneShift', 'onClick:shift');
    this.subscribe('selectAll', keyDown('cmd+KeyA'));
  },

  selectOne() {
    console.log('Selected one', ...arguments);
  },

  selectOneShift() {
    console.log('Selected one + shift', ...arguments);
  },

  selectAll(context, e) {
    console.log('Selected All', ...arguments);
    e.preventDefault();

    let items = this.get('items');
    items.forEach((i) => set(i, 'selected', true));
  }
});
