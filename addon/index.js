import Task from 'ember-evented-tasks/task';
import ETMixin from 'ember-evented-tasks/mixins/evented-tasks';
import { onEvent } from 'ember-evented-tasks/listeners/evented';

export default Task;
export { onEvent, ETMixin };
