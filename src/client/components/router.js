(this.live = new Live(config.signal))
  .on('host', ::this.setHost)
  .on('signal', ({data}) => this.host.signal(data));
if (props.verify) {
  this.live.send('verify', props.verify, (er, auth) => {
    if (er) return console.error(er);
    set('auth', auth);
    console.log('verify authorized!');
  });
} else if (get('auth')) {
  this.live.send('auth', get('auth'), er => {
    if (er) return console.error(er);
    console.log('authorized!');
  });
}
this.live.on('auth', auth => console.log('remote auth!') || set('auth', auth));
this.live.send('sign-in', 'c@sey.me', (er) => {
  console.log(er || 'Email sent');
});
