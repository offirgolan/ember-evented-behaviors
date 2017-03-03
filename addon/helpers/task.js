import Ember from 'ember';

const {
  inject
} = Ember;

export default Ember.Helper.extend({
  eventedTasks: inject.service(),

  compute([ type ], params = {}) {
    return this.get('eventedTasks').lookup(type).create(params);
  }
});
