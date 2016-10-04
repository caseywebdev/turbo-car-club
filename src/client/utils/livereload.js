import config from '../config';

const {url} = config.livereload;

if (url) {
  const script = document.createElement('script');
  script.src = `${url}/livereload.js?port=443`;
  script.async = true;
  document.body.appendChild(script);
}
