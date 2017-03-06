import Ember from 'ember';
import WeakMap from 'ember-weakmap';

const {
  get
} = Ember;

export default class TaskEvent {
  constructor(name, target, method) {
    this.target = target;
    this.name = name;
    this.method = method;
    this.subscribers = new WeakMap();

    this._method = typeof method === 'string' ? get(target, method) : method;
  }

  subscribe(obj) {
    let { subscribers } = this;

    if (!subscribers.has(obj)) {
      let method = this._generateMethodFor(obj);

      obj.on(this.name, this.target, method);
      subscribers.set(obj, method);
    }
  }

  unsubscribe(obj) {
    let { subscribers } = this;

    if (subscribers.has(obj)) {
      obj.off(this.name, this.target, subscribers.get(obj));
      subscribers.delete(obj);
    }
  }

  _generateMethodFor(obj) {
    return (...args) => {
      this._method.call(this.target, obj, ...args);
    };
  }
}
