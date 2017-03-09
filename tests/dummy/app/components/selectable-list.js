import Ember from 'ember';
import layout from '../templates/components/selectable-list';
import { EKMixin, EKOnFocusMixin } from 'ember-keyboard';
import { EBMixin } from 'ember-evented-behaviors';

const {
  inject,
  computed
} = Ember;

export default Ember.Component.extend(EKMixin, EKOnFocusMixin, EBMixin, {
  layout,
  behaviors: inject.service(),

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

    let behaviors = this.get('behaviors');
    let items = this.get('items');

    this.registerBehaviors([
      behaviors.createBehavior('select', { items })
    ]);
  }
});
