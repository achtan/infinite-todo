log = console.log.bind(console);

const superlatives = ['awesome', 'marvelous', 'amazing', 'stunning', 'great', 'magnificent', 'splendid', 'spectacular', 'majestic', 'legendary', 'epic'];
superlative = () => {
  return _.sample(superlatives);
};





// ------------------------------ Router ------------------------------ //
goTo = function(name, parameters) {
  FlowRouter.go(name, parameters);
};

pathFor = ( path, params ) => {
  let query = params && params.query ? FlowRouter._qs.parse( params.query ) : {};
  return FlowRouter.path( path, params, query );
};


urlFor = (route, parameters) => {
  if(Meteor.isServer) {
    path = pathFor(route, parameters);
    if (path.substring(0, 1) == '/') {
      path = path.substring(1);
    }
    return Meteor.absoluteUrl(path);
  } else {
    return '';
  }
};


currentUrl = function() {
  var currentRoute = FlowRouter.current();
  var routeName = currentRoute.route.name;
  // FlowRouter.path() returns a path starting with a '/' but Meteor.absoluteUrl()
  // doesn't want it - that's why we've got the substr(1)
  return Meteor.absoluteUrl(FlowRouter.path(routeName, currentRoute.params).substr(1));
};



isRoute = ( route, otherClasses ) => {
  otherClasses = otherClasses || '';
  FlowRouter.watchPathChange();
  if(!_.isArray(route)) {
    route = [route];
  }

  const match = _.find(route, (value) => {
    return FlowRouter.current().route.name === value;
  });
  return match ? otherClasses + ' active' : otherClasses;
};

