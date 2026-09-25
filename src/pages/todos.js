import { listAll, toggleDone } from '../lib/todoStore.js';
import { openTodoForm } from '../components/todoForm.js';
import { createEmptyState } from '../components/emptyState.js';
import { today, isSameDay, formatDateISO } from '../lib/date.js';

export function renderTodos(container) {
  render(container);
}

function render(container) {
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'todos-page';

  // Header
  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = '<h1>日程</h1>';
  page.appendChild(header);

  // FAB
  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.innerHTML = '⊕';
  fab.addEventListener('click', () => openTodoForm(null, () => render(container)));
  page.appendChild(fab);

  // Todo list
  const listContainer = document.createElement('div');
  listContainer.className = 'todo-list-container';
  listContainer.appendChild(renderTodoList());
  page.appendChild(listContainer);

  container.appendChild(page);
}

function renderTodoList() {
  const todos = listAll();
  const container = document.createElement('div');

  const todayDate = today();

  // Group todos
  const overdue = [];
  const todayTodos = [];
  const future = [];
  const noDate = [];
  const completed = [];

  todos.forEach(todo => {
    if (todo.done) {
      completed.push(todo);
      return;
    }

    if (!todo.date) {
      noDate.push(todo);
      return;
    }

    const todoDate = new Date(todo.date);
    if (todoDate < todayDate && !isSameDay(todoDate, todayDate)) {
      overdue.push(todo);
    } else if (isSameDay(todoDate, todayDate)) {
      todayTodos.push(todo);
    } else {
      future.push(todo);
    }
  });

  // Render groups
  if (overdue.length > 0) {
    container.appendChild(createGroup('已逾期', overdue, true));
  }

  if (todayTodos.length > 0) {
    container.appendChild(createGroup('今天', todayTodos));
  }

  if (future.length > 0) {
    container.appendChild(createGroup('未来', future));
  }

  if (noDate.length > 0) {
    container.appendChild(createGroup('无日期', noDate));
  }

  // Completed (collapsible)
  if (completed.length > 0) {
    container.appendChild(createCompletedGroup(completed));
  }

  if (todos.length === 0) {
    container.appendChild(createEmptyState('还没有日程，点击  创建'));
  }

  return container;
}

function createGroup(title, todos, isOverdue = false) {
  const group = document.createElement('div');
  group.className = 'todo-group';

  const header = document.createElement('div');
  header.className = 'group-header';
  header.innerHTML = `<h3>${title}</h3><span class="group-count">${todos.length}</span>`;
  group.appendChild(header);

  const list = document.createElement('div');
  list.className = 'todo-list';

  todos.forEach(todo => {
    list.appendChild(createTodoItem(todo, isOverdue));
  });

  group.appendChild(list);
  return group;
}

function createCompletedGroup(todos) {
  const group = document.createElement('div');
  group.className = 'todo-group completed-group';

  const header = document.createElement('div');
  header.className = 'group-header';
  header.innerHTML = `<h3>已完成</h3><span class="group-count">${todos.length}</span><span class="expand-icon">▸</span>`;
  header.addEventListener('click', () => {
    const list = group.querySelector('.todo-list');
    const isHidden = list.style.display === 'none';
    list.style.display = isHidden ? 'block' : 'none';
    header.querySelector('.expand-icon').textContent = isHidden ? '▾' : '▸';
  });
  group.appendChild(header);

  const list = document.createElement('div');
  list.className = 'todo-list';
  list.style.display = 'none';

  todos.forEach(todo => {
    list.appendChild(createTodoItem(todo, false, true));
  });

  group.appendChild(list);
  return group;
}

function createTodoItem(todo, isOverdue = false, isCompleted = false) {
  const item = document.createElement('div');
  item.className = `todo-item ${isOverdue ? 'overdue' : ''} ${isCompleted ? 'completed' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.addEventListener('change', () => {
    toggleDone(todo.id);
    item.parentElement.parentElement.parentElement.querySelector('.todos-page') &&
      renderTodos(item.closest('.todos-page').parentElement);
  });

  const content = document.createElement('div');
  content.className = 'todo-content';

  const title = document.createElement('div');
  title.className = 'todo-title';
  title.textContent = todo.title;

  const meta = document.createElement('div');
  meta.className = 'todo-meta';
  const parts = [];
  if (todo.date) parts.push(todo.date);
  if (todo.startTime) parts.push(`${todo.startTime}${todo.endTime ? '-' + todo.endTime : ''}`);
  meta.textContent = parts.join(' ');

  content.appendChild(title);
  if (parts.length > 0) content.appendChild(meta);

  item.appendChild(checkbox);
  item.appendChild(content);

  item.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      openTodoForm(todo, () => {
        const page = item.closest('.todos-page');
        if (page) renderTodos(page.parentElement);
      });
    }
  });

  return item;
}
