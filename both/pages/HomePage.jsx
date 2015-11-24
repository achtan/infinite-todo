HomePage = React.createClass({

  render() {
    return (
      <div id="home-page" className="container m-t-lg">
        <div className="jumbotron text-center">
          <h1>Infinite Tasks</h1>
          <h3>Repeated tasks made easy</h3>
          <div className="btn btn-primary btn-lg m-t" onClick={this.handleCreateList}>Create tasks</div>
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
