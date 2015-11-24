StatsPage = React.createClass({

  render() {
    let title = 'Stats';
    DocHead.setTitle(title);
    DocHead.addMeta({name: 'og:title', content: title});
    DocHead.addMeta({name: 'og:description', content: 'Repeated tasks made easy.'});


    return (
      <div className="container m-t-lg text-center">
        <h3>...coming soon, promise...</h3>
        <a href={pathFor('list', {_id: this.props._id})}>back to list</a>
      </div>
    )
  }

});
