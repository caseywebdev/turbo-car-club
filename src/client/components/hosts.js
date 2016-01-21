// = link src/signal/data/schema.json

import _ from 'underscore';
import getUserDisplayName from '../../shared/utils/get-user-display-name';
import React from 'react';
import Relay from 'react-relay';

const renderHost = ({user, region, name}, i) =>
  <tr key={i}>
    <td>{getUserDisplayName(user)}</td>
    <td>{region}</td>
    <td>{name}</td>
  </tr>;

const renderHosts = hosts =>
  <table>
    <thead><tr><th>Owner</th><th>Region</th><th>Name</th></tr></thead>
    <tbody>{_.map(hosts, renderHost)}</tbody>
  </table>;

export default Relay.createContainer(
  ({hosts}) => <div>{renderHosts(hosts)}</div>,
  {
    fragments: {
      hosts: () => Relay.QL`
        fragment on Host {
          user {
            emailAddress
          },
          name,
          region
        }
      `
    }
  }
);
