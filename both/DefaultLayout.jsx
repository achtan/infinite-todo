DefaultLayout = React.createClass({
  render() {
    DocHead.addLink({rel: 'icon', href: '/favicon.ico?v=1.0'});
    DocHead.addMeta({name: 'og:type', content: 'website'});
    //DocHead.addMeta({name: 'og:image', content: ''});
    DocHead.addMeta({name: 'og:url', content: currentUrl()});


    return (
      <div>
        {this.props.content}
      </div>
    )
  }
});
