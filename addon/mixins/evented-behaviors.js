import Ember from 'ember';

const {
  Evented
} = Ember;

export default Ember.Mixin.create(Evented, {
  willDestroy() {
    this._super(...arguments);

    if (this.__ee_behaviors_) {
      this.__ee_behaviors__.invoke('unregister', this);
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    if (this.__ee_behaviors_) {
      this.__ee_behaviors__.invoke('unregister', this);
    }
  }
});
