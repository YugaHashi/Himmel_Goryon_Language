// URL に ?date=YYYY-MM-DD を自動付与（最初の1回のみ）
(function(){
  const today = new Date().toISOString().slice(0,10);
  if (!/(\?|&)date=/.test(location.search)) {
    const sep = location.search ? '&' : '?';
    location.replace(location.pathname + location.search + sep + 'date=' + today);
  }
})();
