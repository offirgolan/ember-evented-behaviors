import Ember from 'ember';
import Task from 'ember-evented-tasks';
import { keyDown } from 'ember-keyboard';

const {
  set
} = Ember;

export default Task.extend({
  items: null,

  registerEvents() {
    this.register('selectOne', 'click');
    this.register('selectAll', keyDown('cmd+KeyA'));
  },

  selectOne() {
    console.log('Selected one');
  },

  selectAll(context, e) {
    console.log(arguments);
    console.log('Selected All');
    e.preventDefault();

    let items = this.get('items');
    items.forEach((i) => set(i, 'selected', true));
  }
});
