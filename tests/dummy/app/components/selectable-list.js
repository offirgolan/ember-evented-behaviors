import Ember from 'ember';
import layout from '../templates/components/selectable-list';
import { EKMixin, EKOnFocusMixin } from 'ember-keyboard';
import { EBMixin, BehaviorGroup } from 'ember-evented-behaviors';

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

    let selectBehavior = behaviors.createBehavior('select', { items });
    let oneBehavior = behaviors.createBehavior('one');
    let twoBehavior = behaviors.createBehavior('two');

    let group = new BehaviorGroup([
      twoBehavior,
      selectBehavior,
      oneBehavior
    ]);

    // group.register(this);
    group.priorizeBehavior(oneBehavior);
    group.removeBehavior(twoBehavior);
    group.addBehavior(twoBehavior);

    this.set('group', group);
  },

  didInsertElement() {
    this._super(...arguments);
    console.log(this.$('.my-btn'));
    this.get('group').register(this.$('ol'));
    this.get('group').register(this.$('.my-btn'));
  }
});
