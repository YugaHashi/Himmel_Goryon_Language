(function(){
  const today = new Date().toISOString().slice(0,10);
  if (!/(\?|&)date=/.test(window.location.search)) {
    const sep = window.location.search ? '&' : '?';
    window.location.replace(
      window.location.pathname +
      window.location.search +
      sep +
      'date=' +
      today
    );
  }
})();
