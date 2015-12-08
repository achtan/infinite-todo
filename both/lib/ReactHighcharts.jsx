ReactHighcharts = React.createClass({

  propTypes: {
    type: React.PropTypes.string.isRequired,
    config: React.PropTypes.object.isRequired,
    isPureConfig: React.PropTypes.bool
  },

  renderChart: function (config) {
    if (!config) {
      throw new Error('Config must be specified for the chart component');
    }
    let chartConfig = config.chart;
    log(Highcharts)
    this.chart = new Highcharts[this.props.type]({
      ...config,
      chart: {
        ...chartConfig,
        renderTo: this.refs.chart
      }
    });
  },

  shouldComponentUpdate(nextProps) {
    if (!this.props.isPureConfig || !(this.props.config === nextProps.config)) {
      this.renderChart(nextProps.config);
    }
    return true;
  },

  getChart: function () {
    if (!this.chart) {
      throw new Error('getChart() should not be called before the component is mounted');
    }
    return this.chart;
  },

  componentDidMount: function () {
    this.renderChart(this.props.config);
  },

  render: function () {
    let props = this.props;
    props = {
      ...props,
      ref: 'chart'
    };
    return <div {...props} />;
  }
});
