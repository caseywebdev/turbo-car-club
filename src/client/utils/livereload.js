if (__LIVERELOAD__) {
  const script = document.createElement('script');
  const {protocol, hostname} = location;
  script.src = `${protocol}//${hostname}:35729/livereload.js`;
  script.async = true;
  document.body.appendChild(script);
}
