import Ember from 'ember';
import listenerName from 'ember-evented-tasks/utils/listener-name';
import gatherEventKeys from 'ember-evented-tasks/utils/gather-event-keys';

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
  },

  triggerEvent(taskName, ...args) {
    let event = args.pop();
    this.trigger(listenerName(taskName, gatherEventKeys(event)), ...args, event);
  }
});
