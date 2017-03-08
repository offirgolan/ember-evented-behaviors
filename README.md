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

### Creating a New Behavior

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
    this.register('shiftClick', onEvent('click', 'shift'));
    this.register('selectAll', keyDown('cmd+KeyA'));
  },

  onShiftClick(/* context, event */) {
    // Do something on shift + click
  }
});
```

### Subscribing to a Behavior

```js
// components/my-component.js

import Ember from 'ember';
import { EKMixin } from 'ember-keyboard';
import { ETMixin } from 'ember-evented-behaviors';

export default Ember.Component.extend(EKMixin, ETMixin, {
  behaviors: Ember.inject.service(),

  init() {
    this._super(...arguments);

    let behaviors = this.get('behaviors');

    this.subscribeBehaviors([
      behaviors.createBehavior('my-behavior', { foo: 'bar' })
    ]);
  }
});
```

## Behavior API

### `subscribeEvents`

```js
subscribeEvents() {
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
