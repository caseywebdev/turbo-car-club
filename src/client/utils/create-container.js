import _ from 'underscore';
import {Component, PropTypes} from 'react';
import model from '../utils/model';
import React from 'react';
import resolvePath from '../utils/resolve-path';

export default (ContainedComponent, {
  defaultParams = {},
  queries = _.noop,
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
      this.fetch();
    };

    fetch() {
      const paths = _.chain(queries(this.params))
        .reject((__, key) => this.props[key])
        .map(query => _.flatten(_.map(query, resolvePath), true))
        .flatten(true)
        .value();
      if (!paths.length) return;
      ++this.loading;
      model.get(...paths).then(this.handleFetch);
    }

    handleFetch = ({json}) => {
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
