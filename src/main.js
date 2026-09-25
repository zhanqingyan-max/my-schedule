import { initRouter, registerRoute } from './router.js';
import { createNav } from './components/nav.js';
import { renderHome } from './pages/home.js';
import { renderTimetable } from './pages/timetable.js';
import { renderTodos } from './pages/todos.js';
import './styles/components.css';

const appEl = document.getElementById('app');

// Create nav
const nav = createNav();
document.body.appendChild(nav);

// Page containers
const pageContainer = document.createElement('div');
pageContainer.className = 'page-container';
appEl.appendChild(pageContainer);

registerRoute('/home', (el) => {
  renderHome(el);
});

registerRoute('/timetable', (el) => {
  renderTimetable(el);
});

registerRoute('/todos', (el) => {
  renderTodos(el);
});

initRouter(pageContainer);
