import Ember from 'ember';

const {
  A: emberArray
} = Ember;

const BehaviorGroup = Ember.ArrayProxy.extend({
  content: null,
  _receivers: null,

  init() {
    this._super(...arguments);

    this.set('content', emberArray(this.get('content') || []));
    this.reverseObjects();
    this.set('_receivers', emberArray([]));
  },

  addBehavior(behavior) {
    if (!this.includes(behavior)) {
      this.insertAt(0, behavior);
      this._resubscribeToEvents();
    }
  },

  removeBehavior(behavior) {
    this.removeObject(behavior);
    this.get('_receivers').forEach((r) => behavior.unregister(r));
  },

  priorizeBehavior(behavior) {
    this.removeObject(behavior);
    this.pushObject(behavior);
    this._resubscribeToEvents();
  },

  register(receiver) {
    this.get('_receivers').addObject(receiver);
    this.invoke('register', receiver);
  },

  unregister(receiver) {
    this.get('_receivers').removeObject(receiver);
    this.invoke('unregister', receiver);
  },

  _resubscribeToEvents() {
    this.get('_receivers').forEach((r) => {
      this.invoke('_unsubscribeFromEvents', r);
      this.invoke('_subscribeToEvents', r);
    });
  }
});

export default class {
  constructor(content = []) {
    return BehaviorGroup.create({ content });
  }
}
