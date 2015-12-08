FlowRouter.route('/', {
  name: 'home',
  action(params) {
    ReactLayout.render(DefaultLayout, { content: <HomePage /> });
  }
});


FlowRouter.route('/stats', {
  name: 'stats',
  action(params) {
    ReactLayout.render(DefaultLayout, { content: <TotalStatsPage {...params} /> });
  }
});


FlowRouter.route('/:_id', {
  name: 'list',
  action(params) {
    ReactLayout.render(DefaultLayout, { content: <ListPage {...params} /> });
  }
});

FlowRouter.route('/:_id/stats', {
  name: 'listStats',
  action(params) {
    ReactLayout.render(DefaultLayout, { content: <ListStatsPage {...params} /> });
  }
});
