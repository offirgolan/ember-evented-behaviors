import Ember from 'ember';

const {
  Evented
} = Ember;

export default Ember.Mixin.create(Evented, {
  willDestroy() {
    this._super(...arguments);
    this.unregisterBehaviors(this.__ee_behaviors__);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.unregisterBehaviors(this.__ee_behaviors__);
  },

  registerBehaviors(behaviors = []) {
    behaviors.forEach((b) => b.register(this));
  },

  unregisterBehaviors(behaviors = []) {
    behaviors.forEach((b) => b.unregister(this));
  }
});
