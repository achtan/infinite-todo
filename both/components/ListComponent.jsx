ListComponent = React.createClass({

  getInitialState() {
    return {
      editing: false
    }
  },

  render() {
    const list = this.props.list;

    let archivedTemplates;
    if(this.state.editing) {
      archivedTemplates = <div className="task-board">
        <ArchivedTemplatesList list={list} editing={this.state.editing} />
      </div>
    }

    return (
      <div id="list-component">
        <ListHeader list={list} />
        <div className="task-board">
          <TasksList list={list} editing={this.state.editing} />
          <AddTask list={list} />
        </div>
        <div className="m-y-md m-x footer clearfix">
          <div className="pull-left">
            <a href={pathFor('listStats', list)} title="Stats"><i className="fa fa-pie-chart" /></a>
          </div>
          <div className="pull-right">
            <a onClick={this.toggleSettings} href="#" title="Setting">
              <i className="fa fa-cog" />{this.state.editing ? ' done' : ''}
            </a>
          </div>
        </div>
        {archivedTemplates}
      </div>
    )
  },


  toggleSettings(e) {
    e.preventDefault();

    this.setState({editing: !this.state.editing});
  }

});


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


ListHeader = React.createClass({

  render() {
    const list = this.props.list;
    return (
      <Formsy.Form>
        <MyInput className="list-header" name="title" value={list.title} onBlur={this.handleSave} type="text" />
      </Formsy.Form>
    )
  },

  handleSave(e) {
    const list = this.props.list;
    list.set('title', e.currentTarget.value);
    list.save();
  }

});


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

TasksList = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      time: moment()
    }
  },


  getMeteorData() {
    const list = this.props.list;
    const time = this.state.time.format();
    let data = {};
    const handle1 = Meteor.subscribe('listsTasks', list._id, time);
    const handle2 = Meteor.subscribe('listsHistory', list._id, 3, time);
    const handle3 = Meteor.subscribe('listTemplates', list._id);
    if (handle1.ready() && handle2.ready() && handle3.ready()) {
      data.tasks = Tasks.find({}, {sort: {order: 1, doneAt: 1}}).fetch();
    }

    return data;
  },

  render() {
    if(!this.data.tasks) {
      return <Loading />;
    }

    return (
      <div className="task-list">
          {this.renderTasks()}
      </div>
    )
  },

  renderTasks() {
    return this.data.tasks.map((item) => {
      return <TaskItem key={item._id} task={item} template={item.template()} editing={this.props.editing} />
    })
  }

});


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

ArchivedTemplatesList = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    const list = this.props.list;
    let data = {};
    const handle1 = Meteor.subscribe('listsArchivedTemplates', list._id);
    if (handle1.ready()) {
      data.templates = TaskTemplates.find({archived: true}, {sort: {_id: 1}}).fetch();
    }

    return data;
  },

  render() {
    if(!this.data.templates) {
      return <div></div>;
    }

    return (
      <div className="task-list">
          {this.renderTemplates()}
      </div>
    )
  },

  renderTemplates() {
    return this.data.templates.map((item) => {
      return <TaskItem key={item._id} template={item} editing={true} />
    })
  }

});


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


TaskItem = React.createClass({

  render() {
    let task, template, isTemplate, checked;

    if(this.props.task) {
      task = this.props.task;
      template = task.template();
      checked = !!task.doneAt;
    } else {
      template = this.props.template;
      isTemplate = true;
    }


    const itemClass = classNames('task-item flex flex-center', {done: checked, archived: isTemplate});


    let actions;
    let title;

    if(!checked && this.props.editing) {
      let archiveIcon = 'fa fa-archive';
      let archiveTitle = 'Archive';
      if(template.archived) {
        archiveIcon = 'fa fa-undo';
        archiveTitle = 'Activate';
      }
      actions = <div className="toggle-archive p-l p-r-sm">
        <i className={archiveIcon} onClick={this.toggleArchive} title={archiveTitle} />
      </div>;

      title = (
        <Formsy.Form>
          <MyInput className="title-input" name="title" value={template.title} onBlur={this.handleTitleSave} type="text" />
        </Formsy.Form>
      );
    } else {
      actions = <input className="checkbox" type="checkbox" checked={checked} onChange={this.toggleDone}/>;
      title = <div className="title">{template.title}</div>;
    }

    let iteration;
    if(!checked) {
      iteration = <div className="iteration p-x">{template.iteration}</div>;
    }

    return (
      <div className={itemClass}>
        <div className="p-x-sm p-y-sm">
          {actions}
        </div>
        <div className="flex-auto">
          {title}
        </div>
        {iteration}
      </div>
    )
  },

  toggleDone(e) {
    e.preventDefault();
    e.currentTarget.blur();

    const method = this.props.task.doneAt ? 'task.undone' : 'task.done';
    Meteor.call(method, this.props.task._id, (error, result) => {
      if(!error) {
        log('done');
      } else {
        log(error);
      }
    });
  },

  handleTitleSave(e) {
    const template = this.props.template;
    template.set('title', e.currentTarget.value);
    template.save();
  },

  toggleArchive(e) {
    e.preventDefault();

    Meteor.call('task.toggleArchive', this.props.template._id, (error, result) => {
      if(!error) {
        log('done');
      } else {
        log(error);
      }
    });
  }

});


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


AddTask = React.createClass({

  getInitialState() {
    return {
      placeholder: 'New ' + superlative() + ' task'
    }
  },

  render() {
    return (
      <div>
        <form className="new-task" onSubmit={this.handleSubmit}>
          <input className="title" ref="title" type="text" placeholder={this.state.placeholder} />
        </form>
      </div>
    )
  },

  handleSubmit(e) {
    e.preventDefault();

    const title = ReactDOM.findDOMNode(this.refs.title).value.trim();

    Meteor.call('task.create', this.props.list._id,  {title: title}, (error, result) => {
      if(!error) {
        ReactDOM.findDOMNode(this.refs.title).value = "";
        this.setState({placeholder: 'Add another ' + superlative() + ' task'});
      } else {
        log(error);
      }
    })
  }

});
