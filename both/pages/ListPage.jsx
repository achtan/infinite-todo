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
    let title = 'List';
    if(this.data.list) {
      title = this.data.list.title;
    }

    DocHead.setTitle(title);
    DocHead.addMeta({name: 'og:title', content: title});
    DocHead.addMeta({name: 'og:description', content: 'Repeated tasks made easy.'});


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
