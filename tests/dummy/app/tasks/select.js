import Ember from 'ember';
import Task, { onEvent } from 'ember-evented-tasks';
import { keyDown } from 'ember-keyboard';

const {
  set
} = Ember;

export default Task.extend({
  items: null,

  registerEvents() {
    this.register('selectOne', [ onEvent('click'), onEvent('click', 'shift+cmd') ]);
    this.register(this.selectOneShift, onEvent('click', 'shift'));
    this.register('selectAll', keyDown('cmd+KeyA'));
    this.register('unselectAll', keyDown('cmd+KeyU'));
  },

  selectOne() {
    console.log('Selected one');
  },

  selectOneShift() {
    console.log('Selected one + shift');
    this.unregister(this.selectOneShift, 'click:shift');
  },

  selectAll(context, e) {
    console.log('Selected All');
    e.preventDefault();

    let items = this.get('items');
    items.forEach((i) => set(i, 'selected', true));
  },

  unselectAll(context, e) {
    console.log('Unselected All');
    e.preventDefault();

    let items = this.get('items');
    items.forEach((i) => set(i, 'selected', false));
  }
});
