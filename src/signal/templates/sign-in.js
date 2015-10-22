import config from 'signal/config';

export default ({key}) => `
[Here's your sign in link.](${config.client.url}/#sign-in=${key})

If you're not trying to sign in to Turbo Car Club, you can delete this message.
`.trim();
