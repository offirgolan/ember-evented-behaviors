import Ember from 'ember';
import { module, test } from 'qunit';
import Behavior, { onEvent, EBMixin } from 'ember-evented-behaviors';

const EventedObject = Ember.Object.extend(EBMixin);

module('Unit | Behavior');

test('subscribeing events', function(assert) {
  let behavior = Behavior.create();
  let events = behavior.get('_events');

  behavior.subscribe('foo', onEvent('onFoo'));
  assert.equal(events.length, 1, 'Should have 1 event subscribeed');

  behavior.subscribe('foo', onEvent('onFoo'));
  assert.equal(events.length, 1, 'Should have 1 event subscribeed');

  behavior.subscribe('foo', onEvent('onFoo'), true);
  assert.equal(events.length, 2, 'Should have 2 events subscribeed');

  behavior.subscribe('bar', onEvent('onBar'));
  assert.equal(events.length, 3, 'Should have 3 events subscribeed');
});

test('unsubscribeing events', function(assert) {
  let behavior = Behavior.create();
  let events = behavior.get('_events');

  behavior.subscribe('foo', onEvent('onFoo'));
  behavior.subscribe('bar', onEvent('onBar'));

  assert.equal(events.length, 2, 'Should have 2 events subscribeed');

  // Unsubscribe an event that has never been subscribeed should not error
  behavior.unsubscribe('fooBar', onEvent('onFooBar'));
  assert.equal(events.length, 2, 'Should have 2 events subscribeed');

  behavior.unsubscribe('foo', onEvent('onFoo'));
  assert.equal(events.length, 1, 'Should have 1 event subscribeed');

  behavior.unsubscribe('bar', onEvent('onBar'));
  assert.equal(events.length, 0, 'Should have 0 events subscribeed');
});

test('registering objects', function(assert) {
  let behavior = Behavior.create();
  let registrants = behavior.get('_registrants');
  let eventedObj = EventedObject.create();

  assert.throws(() => behavior.register(Ember.Object.create()), () => true, 'Non evented objects should throw an error');

  behavior.register(eventedObj);
  assert.equal(registrants.length, 1, 'Should have 1 subscriber');

  behavior.register(eventedObj);
  assert.equal(registrants.length, 1, 'Should have 1 registrants');
});

test('unregistering objects', function(assert) {
  let behavior = Behavior.create();
  let registrants = behavior.get('_registrants');
  let eventedObj = EventedObject.create();
  let eventedObj2 = EventedObject.create();

  assert.throws(() => behavior.register(Ember.Object.create()), () => true, 'Non evented objects should throw an error');

  behavior.register(eventedObj);
  behavior.register(eventedObj2);
  assert.equal(registrants.length, 2, 'Should have 2 registrants');

  behavior.unregister(EventedObject.create());
  assert.equal(registrants.length, 2, 'Should have 2 registrants');

  behavior.unregister(eventedObj);
  assert.equal(registrants.length, 1, 'Should have 1 registrant');

  behavior.unregister(eventedObj2);
  assert.equal(registrants.length, 0, 'Should have 0 registrants');
});
