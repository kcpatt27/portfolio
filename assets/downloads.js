/* Refreshes all-time npm download counts in place from the public npm API.
   The committed number is the fallback: with JavaScript off, or if the request
   fails, the page keeps the last refreshed value. */
(() => {
  const targets = Array.from(document.querySelectorAll('[data-npm-downloads]'));
  if (targets.length === 0) return;

  const today = new Date().toISOString().slice(0, 10);
  const packages = new Set(targets.map((el) => el.getAttribute('data-npm-downloads')));

  for (const name of packages) {
    if (!name) continue;
    const url = `https://api.npmjs.org/downloads/point/2015-01-10:${today}/${encodeURIComponent(name)}`;
    fetch(url, { referrerPolicy: 'no-referrer' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data || typeof data.downloads !== 'number') return;
        const value = data.downloads.toLocaleString('en-US');
        for (const el of targets) {
          if (el.getAttribute('data-npm-downloads') === name) el.textContent = value;
        }
      })
      .catch(() => { /* keep the static fallback */ });
  }
})();
