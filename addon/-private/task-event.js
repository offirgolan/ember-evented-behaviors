import Ember from 'ember';
import WeakMap from 'ember-weakmap';
import gatherEventKeys from 'ember-evented-tasks/utils/gather-event-keys';

const {
  get
} = Ember;

export default class TaskEvent {
  constructor(name, target, method) {
    this.target = target;
    this.name = name;
    this.method = method;
    this.listeners = new WeakMap();

    this.isEventedEvent = name.indexOf('onEvent:') === 0;
    this._method = typeof method === 'string' ? get(target, method) : method;
  }

  subscribe(obj) {
    let { listeners } = this;

    if (!listeners.has(obj)) {
      let objListeners = [ this._methodCallListenerFor(obj) ];

      if (this.isEventedEvent) {
        objListeners.push(this._generalListenerFor(obj));
      }

      objListeners.forEach((listener) => {
        obj.on(listener.name, listener.target, listener.method);
      });

      listeners.set(obj, objListeners);
    }
  }

  unsubscribe(obj) {
    let { listeners } = this;

    if (listeners.has(obj)) {
      let objListeners = listeners.get(obj);

      objListeners.forEach((listener) => {
        obj.off(listener.name, listener.target, listener.method);
      });

      listeners.delete(obj);
    }
  }

  /**
   * If a task event is registered via `onEvent`, then we need to listen
   * to the general event type. For exmaple, if we have an event name of
   * `onEvent:click:meta+shift`, we listen for all the `click` events on the
   * object and trigger this event if the keys match.
   */
  _generalListenerFor(obj) {
    // jscs:disable
    let nameSegments = this.name.split(':');
    let eventName = nameSegments[1];
    let keysString = nameSegments[2] || '';
    // jscs:enable

    return {
      name: eventName,
      method: (...args) => {
        let event = args.pop();

        if (keysString === gatherEventKeys(event).join('+')) {
          obj.trigger(this.name, ...args, event);
        }
      }
    };
  }

  _methodCallListenerFor(obj) {
    return {
      name: this.name,
      target: this.target,
      method: (...args) => {
        this._method.call(this.target, obj, ...args);
      }
    };
  }
}
