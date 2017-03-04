import Ember from 'ember';
import listenerName from 'ember-evented-tasks/utils/listener-name';

const {
  on,
  Evented
} = Ember;

export default Ember.Mixin.create(Evented, {
  _subscribeTasksAfterInit: on('init', function() {
    this.subscribeTasks(this.get('tasks'));
  }),

  willDestroy() {
    this._super(...arguments);
    this.unsubscribeTasks(this.get('tasks'));
  },

  willDestroyElement() {
    this._super(...arguments);
    this.unsubscribeTasks(this.get('tasks'));
  },

  subscribeTasks(tasks = []) {
    tasks.forEach(t => t.subscribe(this));
  },

  unsubscribeTasks(tasks = []) {
    tasks.forEach(t => t.unsubscribe(this));
  },

  triggerTask(taskName, ...args) {
    let event = args.pop();
    this.trigger(listenerName(taskName, event), ...args, event);
  }
});
