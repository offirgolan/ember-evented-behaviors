import Ember from 'ember';

const {
  inject
} = Ember;

export default Ember.Helper.extend({
  behaviors: inject.service(),

  compute([ type ], params = {}) {
    return this.get('behaviors').createBehavior(type, params);
  }
});
