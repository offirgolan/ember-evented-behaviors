import Ember from 'ember';

const {
  getOwner
} = Ember;

export default Ember.Service.extend({
  lookup(taskName) {
    return getOwner(this).factoryFor(`task:${taskName}`);
  }
});
