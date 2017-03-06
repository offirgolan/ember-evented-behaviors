import Ember from 'ember';
import layout from '../templates/components/selectable-list';
import { EKMixin, EKOnFocusMixin } from 'ember-keyboard';
import { ETMixin } from 'ember-evented-tasks';

const {
  inject,
  computed
} = Ember;

export default Ember.Component.extend(EKMixin, EKOnFocusMixin, ETMixin, {
  layout,
  tasks: inject.service(),

  items: computed(function() {
    return [{
      name: 'One',
      selected: false
    }, {
      name: 'Two',
      selected: false
    }, {
      name: 'Three',
      selected: false
    }, {
      name: 'Four',
      selected: false
    }];
  }),

  click() {
    this._super(...arguments);
    this.trigger('onClick', ...arguments);
  },

  init() {
    this._super(...arguments);

    let tasks = this.get('tasks');
    let items = this.get('items');

    this.subscribeTasks([
      tasks.createTask('select', { items })
    ]);
  }
});
