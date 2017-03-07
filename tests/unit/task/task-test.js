import Ember from 'ember';
import { module, test } from 'qunit';
import Task, { onEvent, ETMixin } from 'ember-evented-tasks';

const EventedObject = Ember.Object.extend(ETMixin);

module('Unit | Task');

test('registering events', function(assert) {
  let task = Task.create();
  let events = task.get('_events');

  task.register('foo', onEvent('onFoo'));
  assert.equal(events.length, 1, 'Should have 1 event registered');

  task.register('foo', onEvent('onFoo'));
  assert.equal(events.length, 1, 'Should have 1 event registered');

  task.register('foo', onEvent('onFoo'), true);
  assert.equal(events.length, 2, 'Should have 2 events registered');

  task.register('bar', onEvent('onBar'));
  assert.equal(events.length, 3, 'Should have 3 events registered');
});

test('unregistering events', function(assert) {
  let task = Task.create();
  let events = task.get('_events');

  task.register('foo', onEvent('onFoo'));
  task.register('bar', onEvent('onBar'));

  assert.equal(events.length, 2, 'Should have 2 events registered');

  // Unregister an event that has never been registered should not error
  task.unregister('fooBar', onEvent('onFooBar'));
  assert.equal(events.length, 2, 'Should have 2 events registered');

  task.unregister('foo', onEvent('onFoo'));
  assert.equal(events.length, 1, 'Should have 1 event registered');

  task.unregister('bar', onEvent('onBar'));
  assert.equal(events.length, 0, 'Should have 0 events registered');
});

test('subscribing objects', function(assert) {
  let task = Task.create();
  let subscribers = task.get('_subscribers');
  let eventedObj = EventedObject.create();

  assert.throws(() => task.subscribe(Ember.Object.create()), () => true, 'Non evented objects should throw an error');

  task.subscribe(eventedObj);
  assert.equal(subscribers.length, 1, 'Should have 1 subscriber');

  task.subscribe(eventedObj);
  assert.equal(subscribers.length, 1, 'Should have 1 subscriber');
});

test('unsubscribing objects', function(assert) {
  let task = Task.create();
  let subscribers = task.get('_subscribers');
  let eventedObj = EventedObject.create();
  let eventedObj2 = EventedObject.create();

  assert.throws(() => task.subscribe(Ember.Object.create()), () => true, 'Non evented objects should throw an error');

  task.subscribe(eventedObj);
  task.subscribe(eventedObj2);
  assert.equal(subscribers.length, 2, 'Should have 2 subscribers');

  task.unsubscribe(EventedObject.create());
  assert.equal(subscribers.length, 2, 'Should have 2 subscribers');

  task.unsubscribe(eventedObj);
  assert.equal(subscribers.length, 1, 'Should have 1 subscriber');

  task.unsubscribe(eventedObj2);
  assert.equal(subscribers.length, 0, 'Should have 0 subscribers');
});
