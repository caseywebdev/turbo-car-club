import cx from '../utils/cx';
import getUserDisplayName from '../../shared/utils/get-user-display-name';
import React from 'react';
// import Peer from '../../shared/peer';
// import live from '../utils/live';

// live.on('signal', ({data}) => window.host.signal(data));
// const setHost = id => {
//   window.host = new Peer()
//     .on('signal', data => live.send('signal', {id, data}))
//     .on('u', t => console.log(Date.now(), t))
//     .on('close', () => setHost(id))
//     .call();
// };

const {host: cxl} = cx;

export default ({host: {owner, name}}) =>
  <div className={cxl.root}>
    <div className={cxl.name}>{name}</div>
    <div className={cxl.owner}>{getUserDisplayName(owner)}</div>
  </div>;

// class FalcorComponent extends Component {
//   constructor(props) {
//     super(props);
//     const {root} = this.construtor;
//     root;
//   }
// }

class User {
  static fragment = () => ['id', 'name'];
}

class Host {
  static fragment = () =>
    ['name', {$type: 'join', value: {owner: [User.fragment()]}}];
}

class Hosts {
  static fragment = () => ['hosts', {from: 0, length: 10}, Host.fragment()];
}

class Main {
  static fragment = () => ['id', 'name'];

  static root = ({id}) => ({
    user: ['usersById', id, [User.fragment()]],
    hosts: Hosts.fragment()
  });

  constructor() {

  }
}
