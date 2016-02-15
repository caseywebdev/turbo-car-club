import {Component} from 'react';
import {toKey} from '../../shared/utils/falcomlay';

export default class extends Component {
  componentWillMount() {
    this.store.on('change', this.runPaths);
    this.runPaths();
    this.runQuery();
  }

  componentDidUpdate() {
    this.runQuery();
  }

  componentWillUnmount() {
    this.store.off('change', this.runPaths);
  }

  runPaths = () => {
    if (!this.getPaths) return;
    const paths = this.getPaths();
    const state = {};
    for (let key in paths) state[key] = this.store.get(paths[key]);
    this.setState(state);
  }

  runQuery({force = false} = {}) {
    if (!this.getQuery || this.isLoading) return;
    const query = this.getQuery();
    const queryKey = toKey(query);
    if (!force && this.prevQueryKey === queryKey) return;
    this.prevQueryKey = queryKey;
    this.setState({isLoading: this.isLoading = true});
    this.store
      .run({force, query})
      .then(() => this.setState({error: null}))
      .catch(error => this.setState({error}))
      .then(() => this.setState({isLoading: this.isLoading = false}));
  }
}
