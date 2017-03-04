import Ember from 'ember';
import TaskEvent from 'ember-evented-tasks/-private/task-event';
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

    this.set('_events', emberArray([]));
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

  _findEvent(method, name) {
    let events = this.get('_events');

    return events.find((event) => {
        return event._fn === method && event.name === name;
    });
  },

  register(method, eventNames) {
    let events = this.get('_events');
    let subscribers = this.get('_subscribers');

    makeArray(eventNames).forEach((name) => {
      events.pushObject(new TaskEvent(name, this, method));
    });

    subscribers.forEach(s => this._subscribe(s));
  },

  unregister(method, eventNames) {
    let events = this.get('_events');
    let subscribers = this.get('_subscribers');

    makeArray(eventNames).forEach((name) => {
      let foundEvent = this._findEvent(method, name);

      if (foundEvent) {
        subscribers.forEach(s => foundEvent.unsubscribe(s));
        events.removeObject(foundEvent);
      }
    });
  },

  subscribe(obj) {
    let subscribers = this.get('_subscribers');

    this._subscribe(obj);
    subscribers.addObject(obj);
  },

  _subscribe(obj) {
    let disabled = this.get('disabled');
    let events = this.get('_events');

    assert(`${obj} must be evented.`, isEventedObject(obj));

    if (disabled) {
      return;
    }

    events.forEach((event) => event.subscribe(obj));
  },

  unsubscribe(obj) {
    let subscribers = this.get('_subscribers');

    this._unsubscribe(obj);
    subscribers.removeObject(obj);
  },

  _unsubscribe(obj) {
    let events = this.get('_events');

    assert(`${obj} must be evented.`, isEventedObject(obj));

    events.forEach((event) => event.unsubscribe(obj));
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
