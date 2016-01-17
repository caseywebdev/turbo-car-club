import Meta from './meta';
import React, {Component, PropTypes} from 'react';

export default class extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static childContextTypes = {
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    location: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      router: this.context.router,
      location: this.props.location
    };
  }

  render() {
    return (
      <Meta title='Turbo Car Club'>
        {this.props.children}
      </Meta>
    );
  }
}
