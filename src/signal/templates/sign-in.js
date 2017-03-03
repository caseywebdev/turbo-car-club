import config from '../config';
import Qs from 'qs';

const {url} = config.client;

export default ({token}) => `
[Here's your sign in link.](${url}/verify?${Qs.stringify({token})})

If you're not trying to sign in to Turbo Car Club, you can delete this message.
`.trim();
