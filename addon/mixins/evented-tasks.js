import Ember from 'ember';
import listenerName from 'ember-evented-tasks/utils/listener-name';

const {
  on,
  Evented
} = Ember;

export default Ember.Mixin.create(Evented, {
  _registerTasksAfterInit: on('init', function() {
    this.registerTasks(this.get('tasks'));
  }),

  willDestroy() {
    this._super(...arguments);
    this.unregisterTasks(this.get('tasks'));
  },

  willDestroyElement() {
    this._super(...arguments);
    this.unregisterTasks(this.get('tasks'));
  },

  registerTasks(tasks = []) {
    tasks.forEach(t => t.register(this));
  },

  unregisterTasks(tasks = []) {
    tasks.forEach(t => t.unregister(this));
  },

  triggerTask(taskName, ...args) {
    let event = args.pop();
    this.trigger(listenerName(taskName, event), ...args, event);
  }
});
