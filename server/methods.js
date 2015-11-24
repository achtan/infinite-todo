getLastTask = (listId) => {
  const listsTasksSelector = {list_id: listId, archived: false};
  return Tasks.findOne(listsTasksSelector, {sort: {order: -1}, limit: 1});
};

Meteor.methods({
  'list.create'() {
    const list = new List();

    return list.save();
  },

  'task.create'(listId, data) {
    check(listId, String);
    check(data, {title: String});

    const list = Lists.findOne(listId);

    if(!list) {
      throw new Error('List not found');
    }

    const taskTemplate = new TaskTemplate({
      list_id: list._id,
      title: data.title
    });

    return taskTemplate.save();
  },

  'task.done'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);

    if(!task) {
      throw new Error('Task not found');
    }

    task.set('doneAt', new Date);
    task.save();

    return true;
  },

  'task.undone'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);

    if(!task) {
      throw new Error('Task not found');
    }

    task.set('doneAt', null);
    task.save();

    return true;
  },

  'task.toggleArchive'(templateId) {
    check(templateId, String);

    const template = TaskTemplates.findOne(templateId);

    if(!template) {
      throw new Error('Task template not found');
    }

    template.set('archived', !template.archived);
    template.save();

    return true;
  }
});
