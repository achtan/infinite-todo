Lists = new Mongo.Collection('lists');

List = Astro.Class({
  name: 'List',
  collection: Lists,
  fields: {
    title: {
      type: 'string',
      default() {
        return 'My ' + superlative() + ' list';
      }
    }
  },

  methods: {
    tasks(all = false) {
      const selector = {list_id: this._id};
      if(!all) {
        selector.archived = false;
      }
      return Tasks.find(selector, {sort: {order: 1}}).fetch();
    },

    doneHistory(limit = null) {
      return DoneTasks.find({list_id: this._id}, {sort: {createdAt: 1}, limit: limit}).fetch();
    },

    firstTask(templateId = null) {
      const listsTasksSelector = {list_id: this._id, doneAt: null};
      if(templateId) {
        listsTasksSelector.template_id = templateId
      }
      return Tasks.findOne(listsTasksSelector, {sort: {order: 1}, limit: 1});
    },

    lastTask(templateId = null) {
      const listsTasksSelector = {list_id: this._id, doneAt: null};
      if(templateId) {
        listsTasksSelector.template_id = templateId
      }
      return Tasks.findOne(listsTasksSelector, {sort: {order: -1}, limit: 1});
    }
  },

  events: {
    afterInsert() {
      const taskTemplate1 = new TaskTemplate({
        list_id: this._id,
        title: 'First ' + superlative() + ' task'
      });
      taskTemplate1.save();


      const taskTemplate2 = new TaskTemplate({
        list_id: this._id,
        title: 'Another ' + superlative() + ' task'
      });
      taskTemplate2.save();
    }
  }
});
