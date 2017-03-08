import Ember from 'ember';

const {
  assert,
  getOwner,
  isNone
} = Ember;

export default Ember.Service.extend({
  createBehavior(behaviorName, params = {}) {
    let Behavior = this.lookup(behaviorName);

    assert(`Could not find a behavior by the name of ${behaviorName}.`, !isNone(Behavior));
    return Behavior.create(params);
  },

  lookup(behaviorName) {
    return getOwner(this).factoryFor(`behavior:${behaviorName}`);
  }
});
