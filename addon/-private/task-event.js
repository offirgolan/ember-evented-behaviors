import formatEventName from 'ember-evented-tasks/utils/format-event-name';
import WeakMap from 'ember-weakmap';

export default class TaskEvent {
  constructor(name, target, fn) {
    this._name = name;
    this._fn = fn;

    this.target = target;
    this.name = formatEventName(name);
    this.fn = typeof fn === 'string' ? target[fn] : fn;

    this.subscribers = new WeakMap();
  }

  _generateFnFor(obj) {
    return (...args) => {
      this.fn.call(this.target, obj, ...args);
    };
  }

  subscribe(obj) {
    let { subscribers } = this;

    if (!subscribers.has(obj)) {
      let fn = this._generateFnFor(obj);

      obj.on(this.name, this.target, fn);
      subscribers.set(obj, fn);
    }
  }

  unsubscribe(obj) {
    let { subscribers } = this;

    if (subscribers.has(obj)) {
      obj.off(this.name, this.target, subscribers.get(obj));
      subscribers.delete(obj);
    }
  }
}
