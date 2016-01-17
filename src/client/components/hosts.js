// = link src/shared/data/schema.json

import _ from 'underscore';
import React from 'react';
import getUserDisplayName from '../../shared/utils/get-user-display-name';

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

export default ({hosts}) => <div>{renderHosts(hosts)}</div>;
