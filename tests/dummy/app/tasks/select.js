import Ember from 'ember';
import Task from 'ember-evented-tasks';
import { keyDown } from 'ember-keyboard';

const {
  set
} = Ember;

export default Task.extend({
  items: null,

  registerEvents() {
    // TODO: Using `:all` doesnt really make much sense. Need to find a different
    // keywork here...
    this.register('selectOne', ['onClick:all', 'onClick:shift']);
    this.register(this.selectOneShift, 'onClick:shift');
    this.register('selectAll', keyDown('cmd+KeyA'));
  },

  selectOne() {
    console.log('Selected one');
  },

  selectOneShift() {
    console.log('Selected one + shift');
    this.unregister(this.selectOneShift, 'onClick:shift');
  },

  selectAll(context, e) {
    console.log('Selected All');
    e.preventDefault();

    let items = this.get('items');
    items.forEach((i) => set(i, 'selected', true));
  }
});
