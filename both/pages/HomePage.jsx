HomePage = React.createClass({

  render() {
    var title = 'Infinite Todo';
    DocHead.setTitle(title);
    DocHead.addMeta({name: 'og:title', content: title});
    DocHead.addMeta({name: 'og:description', content: 'Repeated tasks made easy.'});


    return (
      <div id="home-page" className="container m-t-lg">
        <div className="jumbotron text-center">
          <h1>Infinite Todo</h1>
          <h3>Repeated tasks made easy</h3>
          <div className="btn btn-primary btn-lg m-t" onClick={this.handleCreateList}>Create todo list</div>
          <div className="m-t-lg">
            <TasksChart />
          </div>
        </div>
      </div>
    )
  },

  handleCreateList(e) {
    e.preventDefault();

    Meteor.call('list.create', (error, result) => {
      if(!error) {
        goTo('list', {_id: result});
      }
    });
  }

});
