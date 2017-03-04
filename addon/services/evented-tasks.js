import Ember from 'ember';

const {
  getOwner
} = Ember;

export default Ember.Service.extend({
  createTask(taskName, params) {
    let Task = this.lookup(taskName);
    return Task.create(params);
  },

  lookup(taskName) {
    return getOwner(this).factoryFor(`task:${taskName}`);
  }
});
