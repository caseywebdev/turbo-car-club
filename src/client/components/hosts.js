import _ from 'underscore';
import React, {Component} from 'react';
import Relay from 'react-relay';
import live from '../utils/live';
import * as User from '../../shared/entities/user';

const renderHost = ({user, region, name}, i) => {
  return (
    <tr key={i}>
      <td>{User.getDisplayName(user)}</td>
      <td>{region}</td>
      <td>{name}</td>
    </tr>
  );
};

const renderHosts = hosts =>
  <table>
    <thead><tr><th>Owner</th><th>Region</th><th>Name</th></tr></thead>
    <tbody>{_.map(hosts, renderHost)}</tbody>
  </table>;

class Hosts extends Component {
  state = {
    hosts: null
  };

  componentDidMount() {
    live.send('get-hosts', null, ::this.handleGetHosts);
  }

  handleGetHosts(er, hosts) {
    if (er) return console.error(er);
    this.setState({hosts});
  }

  render() {
    const {hosts} = this.state;
    return (
      <div>{hosts ? renderHosts(hosts) : 'Loading...'}</div>
    );
  }
}

export default Relay.createContainer(Hosts, {
  fragments: {
    foo: () => Relay.QL`

    `
  }
});
