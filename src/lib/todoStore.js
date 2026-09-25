const STORAGE_KEY = 'my-schedule.todos.v1';

function loadTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function addTodo(todo) {
  const todos = loadTodos();
  const newTodo = {
    ...todo,
    id: crypto.randomUUID(),
    done: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
}

export function updateTodo(id, updates) {
  const todos = loadTodos();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return null;
  todos[idx] = { ...todos[idx], ...updates, updatedAt: Date.now() };
  saveTodos(todos);
  return todos[idx];
}

export function removeTodo(id) {
  const todos = loadTodos();
  const filtered = todos.filter(t => t.id !== id);
  if (filtered.length === todos.length) return false;
  saveTodos(filtered);
  return true;
}

export function toggleDone(id) {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) return null;
  todo.done = !todo.done;
  todo.updatedAt = Date.now();
  saveTodos(todos);
  return todo;
}

export function listAll() {
  return loadTodos();
}
