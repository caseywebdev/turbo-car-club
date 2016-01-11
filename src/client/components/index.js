import React, {Component} from 'react';
import Hosts from './hosts';

// live.send('sign-in', 'c@sey.me', (er) => {
//   console.log(er || 'Email sent');
// });

export default class extends Component {
  render() {
    return (
      <div>
        <Hosts />
      </div>
    );
  }
}
