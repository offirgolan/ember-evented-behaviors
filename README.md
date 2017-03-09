# Ember Evented Behaviors

[![Build Status](https://travis-ci.org/offirgolan/ember-evented-behaviors.svg)](https://travis-ci.org/offirgolan/ember-evented-behaviors)
[![npm version](https://badge.fury.io/js/ember-evented-behaviors.svg)](http://badge.fury.io/js/ember-evented-behaviors)

## Features


## Installation

```
ember install ember-evented-behaviors
```

## Helpful Links

- ### [Changelog](CHANGELOG.md)

## Looking for help?
If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-evented-behaviors/issues).

## Usage

### Creating a Behavior

```
ember generate behavior my-behavior
```

```js
// behaviors/my-behavior.js

import Ember from 'ember';
import Behavior, { onEvent } from 'ember-evented-behaviors';
import { keyDown } from 'ember-keyboard';

export default Behavior.extend({
  subscribeEvents() {
    this.subscribe('shiftClick', onEvent('click', 'shift'));
    this.subscribe(this.selectAll, keyDown('cmd+KeyA'));
  },

  shiftClick(/* context, event */) {
    // Do something on shift + click
  },

  selectAll(/* context, event */) {
    // Do something on cmd + A
  }
});
```

### Register a Behavior

```js
// components/my-component.js

import Ember from 'ember';
import { EKMixin } from 'ember-keyboard';
import { EBMixin } from 'ember-evented-behaviors';

export default Ember.Component.extend(EKMixin, EBMixin, {
  behaviors: Ember.inject.service(),

  init() {
    this._super(...arguments);

    let behaviors = this.get('behaviors');

    this.registerBehaviors([
      behaviors.createBehavior('my-behavior', { foo: 'bar' })
    ]);
  }
});
```

## Behavior API

### `subscribeEvents`

```js
subscribeEvents() {
  this.subscribe('shiftClick', onEvent('click', 'shift'));
  this.subscribe('selectAll', keyDown('cmd+KeyA'));
}
```

### `subscribe`

```js
subscribe(methodNameOrCallback, eventNames, once = false)
subscribe('onClick', [ onEvent('click'), onEvent('onClick') ], true);
```

### `unsubscribe`

```js
unsubscribe(methodNameOrCallback, eventNames, once = false)
unsubscribe('onClick', [ onEvent('click'), onEvent('onClick') ], true);
```

### `register`

```js
register(object)
```

### `unregister`

```js
unregister(object)
```
