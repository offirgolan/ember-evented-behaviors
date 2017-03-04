import Ember from 'ember';
import TaskEvent from 'ember-evented-tasks/-private/task-event';
import formatEventName from 'ember-evented-tasks/utils/format-event-name';
import isEventedObject from 'ember-evented-tasks/utils/is-evented-object';

const {
  assert,
  observer,
  makeArray,
  A: emberArray
} = Ember;

export default Ember.Object.extend({
  disabled: false,

  _events: null,
  _registers: null,

  init() {
    this._super(...arguments);

    this.set('_events', {});
    this.set('_registers', emberArray([]));
    this.subscribeEvents();
  },

  destroy() {
    this._super(...arguments);

    this.get('_registers').forEach(s => this.unsubscribe(s));
    this.set('_events', null);
    this.set('_registers', null);
  },

  subscribeEvents() {},

  subscribe(method, eventNames) {
    let events = this.get('_events');
    let formattedEventNames = makeArray(eventNames).map(formatEventName);

    if (!events[method]) {
      events[method] = new TaskEvent();
    }

    events[method].events.addObjects(formattedEventNames);
    this._reregisterAll();
  },

  unsubscribe(method, eventNames) {
    let events = this.get('_events');
    let taskEvent = events[method];

    if (taskEvent) {
      let formattedEventNames = makeArray(eventNames).map(formatEventName);
      taskEvent.events.removeObjects(formattedEventNames);
      this._reregisterAll();
    }
  },

  register(context) {
    let registers = this.get('_registers');

    this._register(context);
    registers.addObject(context);
  },

  _register(context) {
    let disabled = this.get('disabled');
    let events = this.get('_events');

    assert(`${context} must be evented.`, isEventedObject(context));

    if (disabled) {
      return;
    }

    Object.keys(events).forEach(methodName => {
      let taskEvent = events[methodName];

      if (!taskEvent.hasMethod(context)) {
        taskEvent.setMethod(context, function() {
          this[methodName](context, ...arguments);
        });
      }

      taskEvent.events.forEach(eventName => context.on(eventName, this, taskEvent.getMethod(context)));
    });
  },

  unregister(context) {
    let registers = this.get('_registers');
    let events = this.get('_events');

    this._unregister(context);
    registers.removeObject(context);

    Object.keys(events).forEach(methodName => {
      let taskEvent = events[methodName];
      taskEvent.setMethod(context, null);
    });
  },

  _unregister(context) {
    let events = this.get('_events');

    assert(`${context} must be evented.`, isEventedObject(context));

    Object.keys(events).forEach(methodName => {
      let taskEvent = events[methodName];
      taskEvent.events.forEach(eventName => context.off(eventName, this, taskEvent.getMethod(context)));
    });
  },

  _reregisterAll() {
    let registers = this.get('_registers');

    registers.forEach(s => this._unregister(s));
    registers.forEach(s => this._register(s));
  },

  _disabledDidChange: observer('disabled', function() {
    let disabled = this.get('disabled');
    let registers = this.get('_registers');

    if (disabled) {
      registers.forEach(s => this._unregister(s));
    } else {
      registers.forEach(s => this._register(s));
    }
  })
});
