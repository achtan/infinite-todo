TasksChart = React.createClass({

  getInitialState() {
    return {
      data: null
    }
  },

  componentDidMount() {
    const type = this.props.list ? this.props.list._id : 'total';
    Meteor.call('stats.tasks', type, (error, result) => {
      if(!error) {
        log(result);
        this.setState({data: result});
      } else {
        log(error);
      }
    });
  },


  render() {

    if(!this.state.data) {
      return <Loading />
    }

    const config = _.extend({
      title:{
        text: this.props.title || null
      }
    }, this.state.data);



    return (
      <ReactHighcharts type={'Chart'} config={config}/>
    )
  }

});
