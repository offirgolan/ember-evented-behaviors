# Ember Evented Tasks

[![Build Status](https://travis-ci.org/offirgolan/ember-evented-tasks.svg)](https://travis-ci.org/offirgolan/ember-evented-tasks)
[![npm version](https://badge.fury.io/js/ember-evented-tasks.svg)](http://badge.fury.io/js/ember-evented-tasks)

## Features


## Installation

```
ember install ember-evented-tasks
```

## Helpful Links

- ### [Changelog](CHANGELOG.md)

## Looking for help?
If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-evented-tasks/issues).

## Usage

### Creating a New Task

```
ember generate task my-task
```

```js
// tasks/my-task.js

import Ember from 'ember';
import Task, { onEvent } from 'ember-evented-tasks';
import { keyDown } from 'ember-keyboard';

export default Task.extend({
  registerEvents() {
    this.register('shiftClick', onEvent('click', 'shift'));
    this.register('selectAll', keyDown('cmd+KeyA'));
  },

  onShiftClick(/* context, event */) {
    // Do something on shift + click
  }
});
```

### Subscribing to a Task

```js
// components/my-component.js

import Ember from 'ember';
import { EKMixin } from 'ember-keyboard';
import { ETMixin } from 'ember-evented-tasks';

export default Ember.Component.extend(EKMixin, ETMixin, {
  tasks: Ember.inject.service(),

  init() {
    this._super(...arguments);

    let tasks = this.get('tasks');

    this.subscribeTasks([
      tasks.createTask('my-task', { foo: 'bar' })
    ]);
  }
});
```

## Task API

### `registerEvents`

```js
registerEvents() {
  this.register('shiftClick', onEvent('click', 'shift'));
  this.register('selectAll', keyDown('cmd+KeyA'));
}
```

### `register`

```js
register(methodNameOrCallback, eventNames, once = false)
register('onClick', [ onEvent('click'), onEvent('onClick') ], true);
```

### `unregister`

```js
unregister(methodNameOrCallback, eventNames, once = false)
unregister('onClick', [ onEvent('click'), onEvent('onClick') ], true);
```

### `subscribe`

```js
subscribe(object)
```

### `unsubscribe`

```js
unsubscribe(object)
```
