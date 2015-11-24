FlowRouter.route('/', {
  name: 'home',
  action(params) {
    ReactLayout.render(DefaultLayout, { content: <HomePage /> });
  }
});

FlowRouter.route('/:_id', {
  name: 'list',
  action(params) {
    ReactLayout.render(DefaultLayout, { content: <ListPage {...params} /> });
  }
});

FlowRouter.route('/:_id/stats', {
  name: 'stats',
  action(params) {
    ReactLayout.render(DefaultLayout, { content: <StatsPage {...params} /> });
  }
});
