import Ember from 'ember';
import WeakMap from 'ember-weakmap';
import gatherEventKeys from 'ember-evented-behaviors/utils/gather-event-keys';

const {
  get,
  guidFor,
  computed
} = Ember;

export default Ember.Object.extend({
  // Required
  name: null,
  target: null,
  method: null,

  // Optional
  once: false,
  priority: 0,

  // Private
  listeners: computed(() => new WeakMap()),
  methodInvoked: computed(() => new WeakMap()),

  id: computed(function() {
    return guidFor(this);
  }).readOnly(),

  invokableMethod: computed('method', function() {
    let method = this.get('method');
    let target = this.get('target');

    return typeof method === 'string' ? get(target, method) : method;
  }).readOnly(),

  isOnEvent: computed('name', function() {
    return this.get('name').indexOf('onEvent:') === 0;
  }).readOnly(),

  uniqueName: computed('name', 'id', 'isOnEvent', function() {
    let name = this.get('name');
    let id = this.get('id');
    let isOnEvent = this.get('isOnEvent');

    return isOnEvent ? `${id}.${name}` : name;
  }).readOnly(),

  subscribe(obj) {
    let listeners = this.get('listeners');

    if (!listeners.has(obj)) {
      let objListeners = [ this._listenerFor(obj) ];

      if (this.get('isOnEvent')) {
        objListeners.push(this._onEventListenerFor(obj));
      }

      objListeners.forEach((listener) => {
        obj.on(listener.name, listener.target, listener.method);
      });

      listeners.set(obj, objListeners);
    }
  },

  unsubscribe(obj) {
    let listeners = this.get('listeners');

    if (listeners.has(obj)) {
      let objListeners = listeners.get(obj);

      objListeners.forEach((listener) => {
        obj.off(listener.name, listener.target, listener.method);
      });

      listeners.delete(obj);
    }
  },

  /**
   * If a behavior event is registered via `onEvent`, then we need to listen
   * to the general event type. For exmaple, if we have an event name of
   * `onEvent:click:meta+shift`, we listen for all the `click` events on the
   * object and trigger this event if the keys match.
   */
  _onEventListenerFor(obj) {
    // jscs:disable
    let nameSegments = this.get('name').split(':');
    let eventName = nameSegments[1];
    let keysString = nameSegments[2] || '';
    // jscs:enable

    return {
      name: eventName,
      method: (...args) => {
        let event = args.pop();

        if (keysString === gatherEventKeys(event).join('+')) {
          obj.trigger(this.get('uniqueName'), ...args, event);
        }
      }
    };
  },

  _listenerFor(obj) {
    return {
      name: this.get('uniqueName'),
      target: this.get('target'),
      method: (...args) => {
        let methodInvoked = this.get('methodInvoked');
        let once = this.get('once');

        if (once) {
          if (methodInvoked.has(obj)) {
            return;
          }

          methodInvoked.set(obj, true);
        }

        this.get('invokableMethod').call(this.get('target'), obj, ...args);
      }
    };
  }
});
