import _ from 'underscore';
import React, {Component, PropTypes} from 'react';
import store from '../utils/store';

export default (ContainedComponent, {
  defaultParams = {},
  query = _.constant([]),
  paths = _.constant({}),
  ...statics
} = {}) => {
  class Container extends Component {
    static propTypes = {
      params: PropTypes.object
    };

    params = defaultParams;

    subs = [];

    componentWillMount() {
      store.watch(this.update);
      this.setParams(this.props.params);
    }

    componentWillUnmount() {
      store.unwatch(this.update);
    }

    setParams = params => {
      this.params = _.extend({}, this.params, params);
      return this.run();
    };

    run = ({force = false} = {}) => {
      this.setState({isLoading: true});
      return store
        .run({force, query: query(this.params)})
        .then(::this.handleRunResolve, ::this.handleRunReject);
    }

    handleRunResolve() {
      this.setState({
        error: null,
        isLoading: false
      });
      this.update();
    }

    update = () => {
      this.setState(
        _.mapObject(paths(this.params), path => store.get(path))
      );
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
          run={this.run}
        />
      );
    }
  }

  _.extend(Container, statics);

  return Container;
};
