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
  _subscribers: null,

  init() {
    this._super(...arguments);

    this.set('_events', {});
    this.set('_subscribers', emberArray([]));
    this.registerEvents();
  },

  destroy() {
    this._super(...arguments);

    this.get('_subscribers').forEach(s => this.unsubscribe(s));
    this.set('_events', null);
    this.set('_subscribers', null);
  },

  registerEvents() {},

  register(method, eventNames) {
    let events = this.get('_events');
    let formattedEventNames = makeArray(eventNames).map(formatEventName);

    if (!events[method]) {
      events[method] = new TaskEvent();
    }

    events[method].events.addObjects(formattedEventNames);
    this._resubscribeAll();

    console.log(events);
  },

  unregister(method, eventNames) {
    let events = this.get('_events');
    let taskEvent = events[method];

    if (taskEvent) {
      let formattedEventNames = makeArray(eventNames).map(formatEventName);
      taskEvent.events.removeObjects(formattedEventNames);
      this._resubscribeAll();
    }
  },

  subscribe(context) {
    let subscribers = this.get('_subscribers');

    this._subscribe(context);
    subscribers.addObject(context);
  },

  _subscribe(context) {
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

  unsubscribe(context) {
    let subscribers = this.get('_subscribers');
    let events = this.get('_events');

    this._unsubscribe(context);
    subscribers.removeObject(context);

    Object.keys(events).forEach(methodName => {
      let taskEvent = events[methodName];
      taskEvent.setMethod(context, null);
    });
  },

  _unsubscribe(context) {
    let events = this.get('_events');

    assert(`${context} must be evented.`, isEventedObject(context));

    Object.keys(events).forEach(methodName => {
      let taskEvent = events[methodName];
      taskEvent.events.forEach(eventName => context.off(eventName, this, taskEvent.getMethod(context)));
    });
  },

  _resubscribeAll() {
    let subscribers = this.get('_subscribers');

    subscribers.forEach(s => this._unsubscribe(s));
    subscribers.forEach(s => this._subscribe(s));
  },

  _disabledDidChange: observer('disabled', function() {
    let disabled = this.get('disabled');
    let subscribers = this.get('_subscribers');

    if (disabled) {
      subscribers.forEach(s => this._unsubscribe(s));
    } else {
      subscribers.forEach(s => this._subscribe(s));
    }
  })
});
