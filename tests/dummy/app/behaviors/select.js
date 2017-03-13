import Ember from 'ember';
import Behavior, { onEvent } from 'ember-evented-behaviors';
import { keyDown } from 'ember-keyboard';

const {
  set
} = Ember;

export default Behavior.extend({
  items: null,

  subscribeEvents() {
    this.subscribe(this.one, onEvent('click'));
    this.subscribe(this.two, onEvent('click'));

    this.subscribe('selectOne', [ onEvent('click'), onEvent('onClick', 'shift+cmd') ]);
    this.subscribe(this.selectOneShift, onEvent('onClick', 'shift'), true);
    this.subscribe('selectAll', keyDown('cmd+KeyA'));
    this.subscribe('unselectAll', keyDown('cmd+KeyZ'));
  },

  one() {
    console.log('Behavior Select: One');
  },

  two() {
    console.log('Behavior Select: Two');
  },

  selectOne() {
    console.log('Behavior Select: Selected one');
  },

  selectOneShift() {
    console.log('Selected one + shift');
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
