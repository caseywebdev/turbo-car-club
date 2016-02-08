import _ from 'underscore';
import React, {Component, PropTypes} from 'react';
import model from '../utils/model';

export default (ContainedComponent, {
  defaultParams = {},
  queries = _.constant([]),
  remap = _.identity,
  ...statics
} = {}) => {
  class Container extends Component {
    static propTypes = {
      params: PropTypes.object,
      ...statics.propTypes
    };

    params = defaultParams;

    loading = 0;

    constructor(props) {
      super(props);
      this.setParams(props.params);
    }

    setParams = params => {
      this.params = _.extend({}, this.params, params);
      this.run();
    };

    run() {
      ++this.loading;
      run({
        router,
        queries: queries(this.params)
      }).then(this.handleRun);
    }

    handleRun = changes => {
      --this.loading;
      this.setState(remap(json));
    };

    render() {
      return (
        <ContainedComponent
          {...this.state}
          {...this.props}
          isLoading={this.loading > 0}
          params={this.params}
          setParams={this.setParams}
        />
      );
    }
  }

  _.extend(Container, statics);

  return Container;
};
