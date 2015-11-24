ListPage = React.createClass({

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
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-sm-push-3">
            {this.data.list ? <ListComponent list={this.data.list} /> : <Loading />}
          </div>
        </div>
      </div>
    )
  }

});
