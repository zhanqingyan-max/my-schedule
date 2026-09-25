import { describe, it, expect, beforeEach } from 'vitest';
import { addTodo, updateTodo, removeTodo, toggleDone, listAll } from '../lib/todoStore.js';

// Mock localStorage
const storage = {};
const mockLocalStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, value) => { storage[key] = value; },
  removeItem: (key) => { delete storage[key]; },
};

// Replace global localStorage
const originalLocalStorage = globalThis.localStorage;
beforeEach(() => {
  // Clear storage
  Object.keys(storage).forEach(k => delete storage[k]);
  globalThis.localStorage = mockLocalStorage;
});

// Restore after all tests
import { afterAll } from 'vitest';
afterAll(() => {
  globalThis.localStorage = originalLocalStorage;
});

describe('todoStore', () => {
  it('addTodo 应创建新待办', () => {
    const todo = addTodo({ title: '测试待办', date: '2026-09-25' });
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe('测试待办');
    expect(todo.done).toBe(false);
  });

  it('listAll 应返回所有待办', () => {
    addTodo({ title: '待办1', date: '2026-09-25' });
    addTodo({ title: '待办2', date: '2026-09-26' });
    const todos = listAll();
    expect(todos).toHaveLength(2);
  });

  it('updateTodo 应更新待办', () => {
    const todo = addTodo({ title: '原待办', date: '2026-09-25' });
    const updated = updateTodo(todo.id, { title: '新标题' });
    expect(updated.title).toBe('新标题');
  });

  it('removeTodo 应删除待办', () => {
    const todo = addTodo({ title: '待删除', date: '2026-09-25' });
    const removed = removeTodo(todo.id);
    expect(removed).toBe(true);
    expect(listAll()).toHaveLength(0);
  });

  it('toggleDone 应切换完成状态', () => {
    const todo = addTodo({ title: '待办', date: '2026-09-25' });
    expect(todo.done).toBe(false);
    const toggled = toggleDone(todo.id);
    expect(toggled.done).toBe(true);
    const toggledBack = toggleDone(todo.id);
    expect(toggledBack.done).toBe(false);
  });

  it('localStorage 损坏时应返回空数组', () => {
    mockLocalStorage.setItem('my-schedule.todos.v1', 'invalid json');
    expect(listAll()).toEqual([]);
  });
});
