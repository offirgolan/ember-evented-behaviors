import Ember from 'ember';

const {
  guidFor,
  A: emberArray
} = Ember;

export default class TaskEvent {
  constructor() {
    this.events = emberArray([]);
    this.methods = {};
  }

  hasMethod(context) {
    return !!this.getMethod(context);
  }

  getMethod(context) {
    return this.methods[guidFor(context)];
  }

  setMethod(context, fn) {
    this.methods[guidFor(context)] = fn;
  }
}
