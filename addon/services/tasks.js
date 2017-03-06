import Ember from 'ember';

const {
  assert,
  getOwner,
  isNone
} = Ember;

export default Ember.Service.extend({
  createTask(taskName, params = {}) {
    let Task = this.lookup(taskName);

    assert(`Could not find a task by the name of ${taskName}.`, !isNone(Task));
    return Task.create(params);
  },

  lookup(taskName) {
    return getOwner(this).factoryFor(`task:${taskName}`);
  }
});
