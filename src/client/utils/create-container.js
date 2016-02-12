import _ from 'underscore';
import React, {Component, PropTypes} from 'react';
import store from '../utils/store';

export default (ContainedComponent, {
  defaultParams = {},
  query = _.constant([]),
  props = _.constant({}),
  ...statics
} = {}) => {
  class Container extends Component {
    static propTypes = {
      params: PropTypes.object
    };

    params = defaultParams;

    loading = 0;

    componentWillMount() {
      this.setParams(this.props.params);
    }

    setParams = params => {
      this.params = _.extend({}, this.params, params);
      return this.run();
    };

    run() {
      this.setState({isLoading: true});
      return store
        .run({query: query(this.params)})
        .then(::this.handleRunResolve, ::this.handleRunReject);
    }

    handleRunResolve() {
      this.setState({
        error: null,
        isLoading: false,
        ..._.mapObject(props(this.params), path => store.get(path))
      });
    }

    handleRunReject(er) {
      this.setState({
        error: er,
        isLoading: false
      });
    }

    render() {
      return (
        <ContainedComponent
          {...this.state}
          {...this.props}
          params={this.params}
          setParams={this.setParams}
        />
      );
    }
  }

  _.extend(Container, statics);

  return Container;
};
