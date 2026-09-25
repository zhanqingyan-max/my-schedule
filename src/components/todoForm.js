import { openModal, closeModal } from './modal.js';
import { confirmDialog } from './confirm.js';
import { addTodo, updateTodo, removeTodo } from '../lib/todoStore.js';
import { formatDateISO, today } from '../lib/date.js';

export function openTodoForm(todo = null, onSave) {
  const isEdit = todo !== null;

  const content = document.createElement('form');
  content.className = 'todo-form';
  content.innerHTML = `
    <div class="form-group">
      <label for="todo-title">标题 *</label>
      <input type="text" id="todo-title" required value="${isEdit ? todo.title : ''}" />
    </div>
    <div class="form-group">
      <label for="todo-date">日期 *</label>
      <input type="date" id="todo-date" required value="${isEdit ? todo.date : formatDateISO(today())}" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="todo-start">开始时间</label>
        <input type="time" id="todo-start" value="${isEdit && todo.startTime ? todo.startTime : ''}" />
      </div>
      <div class="form-group">
        <label for="todo-end">结束时间</label>
        <input type="time" id="todo-end" value="${isEdit && todo.endTime ? todo.endTime : ''}" />
      </div>
    </div>
    <div class="form-group">
      <label for="todo-note">备注</label>
      <textarea id="todo-note" rows="3">${isEdit && todo.note ? todo.note : ''}</textarea>
    </div>
    <div class="form-actions">
      ${isEdit ? '<button type="button" class="btn btn-danger" data-action="delete">删除</button>' : ''}
      <button type="button" class="btn btn-secondary" data-action="cancel">取消</button>
      <button type="submit" class="btn btn-primary">${isEdit ? '保存' : '创建'}</button>
    </div>
  `;

  openModal({ title: isEdit ? '编辑日程' : '新建日程', content, mode: 'sheet' });

  // Cancel
  content.querySelector('[data-action="cancel"]').addEventListener('click', closeModal);

  // Delete
  if (isEdit) {
    content.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      const confirmed = await confirmDialog('确定删除这条日程？');
      if (confirmed) {
        removeTodo(todo.id);
        closeModal();
        onSave();
      }
    });
  }

  // Submit
  content.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      title: content.querySelector('#todo-title').value.trim(),
      date: content.querySelector('#todo-date').value,
      startTime: content.querySelector('#todo-start').value || null,
      endTime: content.querySelector('#todo-end').value || null,
      note: content.querySelector('#todo-note').value.trim(),
    };

    if (isEdit) {
      updateTodo(todo.id, data);
    } else {
      addTodo(data);
    }

    closeModal();
    onSave();
  });
}
