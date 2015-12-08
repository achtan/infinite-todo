const toDictionary = (data, value) => {
  const dic = {};
  _.each(data, v => {
    let key = v['_id']['year'] + '-' + v['_id']['month'] + '-' + v['_id']['day'];
    dic[key] = v[value];
  });

  return dic;
};

const fillTimeline = (from, to, dictionary) => {
  const diff = to.diff(from, 'days');
  const timeline = [];
  const date = from.clone();
  for(var i = 0; i <= diff; i++) {
    let match = dictionary[date.format('YYYY-MM-D')];
    if(match) {
      timeline.push(match);
    } else {
      timeline.push(0);
    }
    date.add(1, 'day');
  }

  return timeline;
};

Meteor.methods({
  'stats.tasks'(listId) {
    check(listId, String);

    const groupPipeline = {
      $group : {
        _id : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
        count: { $sum: 1 }
      }
    };

    const sortPipeline = {$sort : { '_id.year': 1, '_id.month': 1, '_id.day': 1 }};

    let lists;
    if(listId == 'total') {
      const listPipelines = [];
      listPipelines.push(groupPipeline);
      listPipelines.push(sortPipeline);
      lists = Lists.aggregate(listPipelines);
    }

    const taskTemplatesPipelines = [];
    if(listId != 'total') taskTemplatesPipelines.push({$match: {list_id: listId}});
    taskTemplatesPipelines.push(groupPipeline);
    taskTemplatesPipelines.push(sortPipeline);
    const taskTemplates = TaskTemplates.aggregate(taskTemplatesPipelines);

    const tasksPipelines = [];
    if(listId != 'total') tasksPipelines.push({$match: {list_id: listId}});
    tasksPipelines.push(groupPipeline);
    tasksPipelines.push(sortPipeline);
    const tasks = Tasks.aggregate(tasksPipelines);

    const timelineTo = moment();
    const timelineFrom = moment().clone().add(-30, 'days');

    const series = [];
    if(listId == 'total') {
      series.push({color: '#5d8fae', name: 'Todo lists', data: fillTimeline(timelineFrom, timelineTo, toDictionary(lists, 'count'))});
    }
    series.push({color: '#644034', name: 'Tasks', data: fillTimeline(timelineFrom, timelineTo, toDictionary(taskTemplates, 'count'))});
    series.push({color: '#c9c7a1', name: 'Done Tasks', data: fillTimeline(timelineFrom, timelineTo, toDictionary(tasks, 'count'))});

    const stats = {
      chart: {
        type: 'spline',
        plotBackgroundColor: null,
        backgroundColor: null,
        spacing: [0, 0, 0, 0]
      },
      title: {
        text: null
      },
      subTitle: {
        text: null
      },
      tooltip: {
        enabled: false
      },
      xAxis: {
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
          enabled: false
        },
        minorTickLength: 0,
        tickLength: 0
      },
      yAxis: {
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        gridLineColor: 'transparent',
        labels: {
          enabled: false
        },
        title: {
          enabled: false
        },
        minorTickLength: 0,
        tickLength: 0
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false
              }
            }
          }
        }
      },
      series: series
    };

    return stats;
  }
});
