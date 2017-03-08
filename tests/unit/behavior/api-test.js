import Ember from 'ember';
import { module, test } from 'qunit';
import Behavior, { onEvent, ETMixin } from 'ember-evented-behaviors';

const EventedObject = Ember.Object.extend(ETMixin);

const {
  run
} = Ember;

module('Unit | Behavior | API');

test('general functionality', function(assert) {
  assert.expect(5);

  let eventedObject = EventedObject.create();

  let BehaviorClass = Behavior.extend({
    subscribeEvents() {
      this.register('foo', onEvent('doFoo'));
      this.register(this.bar, onEvent('doBar'));
    },

    foo(obj, name) {
      assert.ok(true, 'Reached named method foo');
      assert.equal(obj, eventedObject, 'Passed object context is correct');
      assert.equal(name, 'foo', 'Passed name argument is correct');
    },

    bar(obj) {
      assert.ok(true, 'Reached referenced method bar');
      assert.equal(obj, eventedObject, 'Passed object context is correct');
    }
  });

  eventedObject.registerBehaviors([ BehaviorClass.create() ]);

  run(() => {
    eventedObject.trigger('doFoo', 'foo');
    eventedObject.trigger('doBar');
  });
});
