import config from 'signal/config';
import Qs from 'qs';

const {url} = config.client;

export default ({key}) => `
[Here's your sign in link.](${url}/verify?${Qs.stringify({key})})

If you're not trying to sign in to Turbo Car Club, you can delete this message.
`.trim();
