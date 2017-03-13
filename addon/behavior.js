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
  _receivers: null,

  init() {
    this._super(...arguments);

    this.set('_events', emberArray([]));
    this.set('_receivers', emberArray([]));

    this.subscribeEvents();
  },

  destroy() {
    this._super(...arguments);

    this.get('_receivers').forEach((r) => this.unsubscribe(r));
    this.set('_events', null);
    this.set('_receivers', null);
  },

  subscribeEvents() {},

  subscribe(method, eventNames, once = false) {
    let events = this.get('_events');
    let receivers = this.get('_receivers');

    makeArray(eventNames).forEach((name) => {
      let foundEvent = this._findEvent(method, name, once);

      if (!foundEvent) {
        let behaviorEvent = BehaviorEvent.create({ name, method, once, target: this });

        // Insert at the beginning to preserve order
        events.insertAt(0, behaviorEvent);

        // Subscribe the new event to all current receivers
        receivers.forEach((s) => behaviorEvent.subscribe(s));
      }
    });
  },

  unsubscribe(method, eventNames, once = false) {
    let events = this.get('_events');
    let receivers = this.get('_receivers');

    makeArray(eventNames).forEach((name) => {
      let foundEvent = this._findEvent(method, name, once);

      if (foundEvent) {
        receivers.forEach((r) => foundEvent.unsubscribe(r));
        events.removeObject(foundEvent);
      }
    });
  },

  register(receiver) {
    let receivers = this.get('_receivers');

    assert(`${receiver} must be evented.`, isEventedObject(receiver));

    if (!receivers.includes(receiver)) {
      receiver.__ee_behaviors__ = receiver.__ee_behaviors__ || emberArray([]);

      this._subscribeToEvents(receiver);
      receivers.addObject(receiver);
      receiver.__ee_behaviors__.addObject(this);
    }
  },

  _subscribeToEvents(receiver) {
    if (!this.get('disabled')) {
      this.get('_events').invoke('subscribe', receiver);
    }
  },

  unregister(receiver) {
    let receivers = this.get('_receivers');

    if (receivers.includes(receiver)) {
      this._unsubscribeFromEvents(receiver);
      receivers.removeObject(receiver);
      receiver.__ee_behaviors__.removeObject(this);
    }
  },

  _unsubscribeFromEvents(receiver) {
    this.get('_events').invoke('unsubscribe', receiver);
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
    let receivers = this.get('_receivers');

    if (disabled) {
      receivers.forEach((s) => this._unsubscribeFromEvents(s));
    } else {
      receivers.forEach((s) => this._subscribeToEvents(s));
    }
  })
});
