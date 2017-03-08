import Ember from 'ember';
import BehaviorEvent from 'ember-evented-behaviors/-private/behavior-event';
import isEventedObject from 'ember-evented-behaviors/utils/is-evented-object';

const {
  assert,
  observer,
  makeArray,
  A: emberArray
} = Ember;

export default Ember.Object.extend({
  disabled: false,

  // Private
  _events: null,
  _registrants: null,

  init() {
    this._super(...arguments);

    this.set('_events', emberArray([]));
    this.set('_registrants', emberArray([]));

    this.subscribeEvents();
  },

  destroy() {
    this._super(...arguments);

    this.get('_registrants').forEach((s) => this.unsubscribe(s));
    this.set('_events', null);
    this.set('_registrants', null);
  },

  subscribeEvents() {},

  subscribe(method, eventNames, once = false) {
    let events = this.get('_events');
    let registrants = this.get('_registrants');

    makeArray(eventNames).forEach((name) => {
      let foundEvent = this._findEvent(method, name, once);

      if (!foundEvent) {
        let behaviorEvent = new BehaviorEvent(name, this, method, once);

        registrants.forEach((s) => behaviorEvent.subscribe(s));
        events.pushObject(behaviorEvent);
      }
    });
  },

  unsubscribe(method, eventNames, once = false) {
    let events = this.get('_events');
    let registrants = this.get('_registrants');

    makeArray(eventNames).forEach((name) => {
      let foundEvent = this._findEvent(method, name, once);

      if (foundEvent) {
        registrants.forEach((s) => foundEvent.unsubscribe(s));
        events.removeObject(foundEvent);
      }
    });
  },

  register(obj) {
    let registrants = this.get('_registrants');

    assert(`${obj} must be evented.`, isEventedObject(obj));

    if (!registrants.includes(obj)) {
      obj.__ee_behaviors__ = obj.__ee_behaviors__ || emberArray([]);

      this._register(obj);
      registrants.addObject(obj);
      obj.__ee_behaviors__.addObject(this);
    }
  },

  _register(obj) {
    let disabled = this.get('disabled');
    let events = this.get('_events');

    if (disabled) {
      return;
    }

    events.forEach((event) => event.subscribe(obj));
  },

  unregister(obj) {
    let registrants = this.get('_registrants');

    if (registrants.includes(obj)) {
      this._unregister(obj);
      registrants.removeObject(obj);
      obj.__ee_behaviors__.removeObject(this);
    }
  },

  _unregister(obj) {
    this.get('_events').forEach((event) => event.unsubscribe(obj));
  },

  _findEvent(method, name, once) {
    let events = this.get('_events');

    return events.find((event) => {
      return event.method === method &&
             event.name === name &&
             event.once === once;
    });
  },

  _disabledDidChange: observer('disabled', function() {
    let disabled = this.get('disabled');
    let registrants = this.get('_registrants');

    if (disabled) {
      registrants.forEach((s) => this._unregister(s));
    } else {
      registrants.forEach((s) => this._register(s));
    }
  })
});
