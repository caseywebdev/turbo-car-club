import _ from 'underscore';
import React, {Component, PropTypes} from 'react';

const components = new Set();

export default class extends Component {
  static propTypes = {
    children: PropTypes.element,
    title: PropTypes.string
  }

  constructor(props) {
    super(props);
    components.add(this);
  }

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate() {
    this.updateTitle();
  }

  componentWillUnmount() {
    components.delete(this);
  }

  updateTitle() {
    const titles = [];
    components.forEach(({props: {title}}) => titles.push(title));
    document.title = _.compact(titles).join(' > ');
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
