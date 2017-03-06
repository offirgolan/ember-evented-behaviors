import Ember from 'ember';

const {
  Evented
} = Ember;

export default Ember.Mixin.create(Evented, {
  willDestroy() {
    this._super(...arguments);
    this.unsubscribeTasks(this.__ee_tasks__);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.unsubscribeTasks(this.__ee_tasks__);
  },

  subscribeTasks(tasks = []) {
    tasks.forEach((t) => t.subscribe(this));
  },

  unsubscribeTasks(tasks = []) {
    tasks.forEach((t) => t.unsubscribe(this));
  }
});
