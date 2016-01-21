// = link src/signal/data/schema.json

import React, {Component} from 'react';
import Relay from 'react-relay';
import Hosts from './hosts';
// import live from '../utils/live';

// live.send('sign-in', 'c@sey.me', (er) => {
//   console.log(er || 'Email sent');
// });

export default Relay.createContainer(
  class extends Component {
    render() {
      return (
        <div>
          <Hosts />
        </div>
      );
    }
  },
  {
    fragments: {
      hosts: () => Relay.QL`
        fragment on Host {
          user {
            id,
            name,
            emailAddress
          },
          name,
          region
        }
      `
    }
  }
);
