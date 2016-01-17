import Hosts from '../components/hosts';
import Relay from 'relay';

export default Relay.createContainer(Hosts, {
  fragments: {
    hosts: () => Relay.QL`
      fragment on Host {
        user,
        name,
        region
      }
    `
  }
});
