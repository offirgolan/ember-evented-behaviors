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
  eventedTasks: inject.service(),
  tasks: null,
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

  click(e) {
    this._super(...arguments);
    this.triggerTask('onClick', e);
  },

  init() {
    this._super(...arguments);

    let eventedTasks = this.get('eventedTasks');
    let items = this.get('items');

    this.set('tasks', [
      eventedTasks.lookup('select').create({ items })
    ]);
  }
});
