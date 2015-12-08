ListStatsPage = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};
    const handle = Meteor.subscribe('list', this.props._id);
    if (handle.ready()) {
      data.list = List.findOne(this.props._id);

      if(!data.list) {
        goTo('home');
      }
    }

    return data;
  },



  render() {
    let title = 'List Stats';
    DocHead.setTitle(title);
    DocHead.addMeta({name: 'og:title', content: title});
    DocHead.addMeta({name: 'og:description', content: 'Repeated tasks made easy.'});

    const list = this.data.list;
    if(!list) {
      return <Loading />
    }

    return (
      <div className="container m-t-lg text-center">
        <h3>Stats for <a href={pathFor('list', {_id: this.props._id})}>{list.title}</a></h3>
        <TasksChart list={list} />
      </div>
    )
  }

});
