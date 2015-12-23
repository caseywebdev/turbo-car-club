import React, {Component} from 'react';

export default class extends Component {
  contextTypes: {
    routeHandlers: React.PropTypes.array.isRequired
  }

  getTitle() {
    return 'Turbo Car Club';
  }

  componentDidMount() {
    console.log('layout mount');
    this.updateTitle();
  }

  componentDidUpdate() {
    this.updateTitle();
  }

  updateTitle() {
    document.title = 'Foo Bar';
  }

  render() {
    return (
      <div>
        Layout!
        {this.props.children}
      </div>
    );
  }
}
