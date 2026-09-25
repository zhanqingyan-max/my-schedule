const routes = {};

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  window.location.hash = '#' + path;
}

function getCurrentPath() {
  const hash = window.location.hash.slice(1) || '/home';
  return hash;
}

export function initRouter(appEl) {
  function render() {
    const path = getCurrentPath();
    const renderFn = routes[path] || routes['/home'];
    appEl.innerHTML = '';
    if (renderFn) {
      renderFn(appEl);
    }
    updateNavHighlight(path);
  }

  window.addEventListener('hashchange', render);
  render();
}

function updateNavHighlight(path) {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === path);
  });
}
