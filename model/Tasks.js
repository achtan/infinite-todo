Tasks = new Mongo.Collection('tasks');

Task = Astro.Class({
  name: 'Task',
  collection: Tasks,
  fields: {
    template_id: {
      type: 'string',
      index: 1
    },

    list_id: {
      type: 'string',
      index: 1
    },

    order: {
      type: 'number',
      index: 1
    },

    doneAt: {
      type: 'date',
      index: 1
    },

    createdAt: {
      type: 'date',
      index: 1,
      default() {
        return new Date()
      }
    }
  },

  methods: {
    template() {
      return TaskTemplates.findOne(this.template_id)
    }
  },

  events: {
    afterInsert() {
      const template = this.template();
      this.set('list_id', template.list_id);
      this.save();
    },

    beforeUpdate(e) {
      const oldDoneAt = e.target._original.doneAt;
      const doneAt = e.target.doneAt;
      if(oldDoneAt == null && !!doneAt) { // task set as done
        // set order to 0
        this.set('order', 0);

        // inc template iteration
        const template = this.template();
        template.inc('iteration', 1);
        template.save();

        // clone task
        const lastTask = template.list().lastTask();
        const newTask = new Task({
          template_id: this.template_id,
          order: lastTask.order + 1
        });
        newTask.save();
      }

      if(!!oldDoneAt && doneAt == null) { // task set as not-done
        const template = this.template();
        template.inc('iteration', -1);
        template.save();

        // remove duplicate task
        const activeTask = template.activeTask();
        Tasks.remove(activeTask._id);

        // set order
        const firstTask = template.list().firstTask();
        this.set('order', firstTask.order - 1);
      }
    }
  }
});
