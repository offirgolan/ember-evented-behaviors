import Ember from 'ember';
import { module, test } from 'qunit';
import Task, { onEvent, ETMixin } from 'ember-evented-tasks';

const EventedObject = Ember.Object.extend(ETMixin);

const {
  run
} = Ember;

module('Unit | Task | API');

test('general functionality', function(assert) {
  assert.expect(5);

  let eventedObject = EventedObject.create();

  let TaskClass = Task.extend({
    registerEvents() {
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

  eventedObject.subscribeTasks([ TaskClass.create() ]);

  run(() => {
    eventedObject.trigger('doFoo', 'foo');
    eventedObject.trigger('doBar');
  });
});
