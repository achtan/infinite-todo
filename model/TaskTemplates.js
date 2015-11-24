const createActiveTask = (template) => {
  const lastTask = template.list().lastTask();
  const task = new Task({
    template_id: template._id,
    order: lastTask ? (lastTask.order + 1) : 50 // start at 50
  });

  task.save();

  return task;
};

TaskTemplates = new Mongo.Collection('taskTemplates');

TaskTemplate = Astro.Class({
  name: 'TaskTemplate',
  collection: TaskTemplates,
  fields: {
    list_id: {
      type: 'string',
      index: 1
    },

    title: 'string',

    iteration: {
      type: 'number',
      default: 0
    },

    archived: {
      type: 'boolean',
      default: false
    }
  },

  methods: {
    list() {
      return List.findOne(this.list_id)
    },

    activeTask() {
      return this.list().lastTask(this._id);
    }
  },

  events: {
    afterInsert() {
      createActiveTask(this)
    },

    beforeUpdate(e) {
      const oldArchived = e.target._original.archived;
      const archived = e.target.archived;

      if(!oldArchived && archived) { // template archived
        const task = this.activeTask();
        Tasks.remove(task._id);
      }

      if(!archived && oldArchived) { // template activated
        createActiveTask(this);
      }
    }
  }
});
