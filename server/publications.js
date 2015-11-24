Meteor.publish('list', function(id) {
  check(id, String);

  return Lists.find(id);
});


Meteor.publish('listTemplates', function(listId) {
  check(listId, String);

  return TaskTemplates.find({list_id: listId});
});


Meteor.publish('listsTasks', function(listId, breakpoint) {
  check(listId, String);
  check(breakpoint, String);
  breakpoint = moment(breakpoint);


  return Tasks.find({
    list_id: listId,
    $or: [{doneAt: null}, {doneAt: {$gte: breakpoint.toDate()}}]
  });
});

Meteor.publish('listsHistory', function(listId, limit, breakpoint) {
  check(listId, String);
  check(limit, Number);
  check(breakpoint, String);
  breakpoint = moment(breakpoint);

  if(limit > 100) limit = 100;

  return Tasks.find({list_id: listId, doneAt: {$lt: breakpoint.toDate()}}, {sort: {createdAt: -1}, limit: limit});
});

Meteor.publish('listsArchivedTemplates', function(listId) {
  check(listId, String);

  return TaskTemplates.find({list_id: listId, archived: true});
});

