// = link src/shared/data/schema.json

import _ from 'underscore';
import React from 'react';
import Relay from 'react-relay';
import User from './user';

const renderHost = ({user, region, name}, i) =>
  <tr key={i}>
    <td>{User.getDisplayName(user)}</td>
    <td>{region}</td>
    <td>{name}</td>
  </tr>;

const renderHosts = hosts =>
  <table>
    <thead><tr><th>Owner</th><th>Region</th><th>Name</th></tr></thead>
    <tbody>{_.map(hosts, renderHost)}</tbody>
  </table>;

const Hosts = ({hosts}) => <div>{renderHosts(hosts)}</div>;

export default Relay.createContainer(Hosts, {
  fragments: {
    hosts: () => Relay.QL`
      fragment on Host {
        ${User.getFragment()},
        name,
        region
      }
    `
  }
});
