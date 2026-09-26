import { openModal, closeModal } from './modal.js';
import { confirmDialog } from './confirm.js';
import { addHomework, updateHomework, removeHomework } from '../lib/homeworkStore.js';
import { formatDateISO, today } from '../lib/date.js';

export function openHomeworkForm(hw = null, onSave) {
  const isEdit = hw !== null;

  const content = document.createElement('form');
  content.className = 'homework-form';
  content.innerHTML = `
    <div class="form-group">
      <label for="hw-title">作业标题 *</label>
      <input type="text" id="hw-title" required value="${isEdit ? hw.title : ''}" placeholder="例如：高数第三章习题" />
    </div>
    <div class="form-group">
      <label for="hw-due">截止日期 *</label>
      <input type="date" id="hw-due" required value="${isEdit ? hw.dueDate : formatDateISO(today())}" />
    </div>
    <div class="form-group">
      <label for="hw-note">备注</label>
      <textarea id="hw-note" rows="2" placeholder="选填">${isEdit && hw.note ? hw.note : ''}</textarea>
    </div>
    <div class="form-actions">
      ${isEdit ? '<button type="button" class="btn btn-danger" data-action="delete">删除</button>' : ''}
      <button type="button" class="btn btn-secondary" data-action="cancel">取消</button>
      <button type="submit" class="btn btn-primary">${isEdit ? '保存' : '添加'}</button>
    </div>
  `;

  openModal({ title: isEdit ? '编辑作业' : '添加作业', content, mode: 'sheet' });

  content.querySelector('[data-action="cancel"]').addEventListener('click', closeModal);

  if (isEdit) {
    content.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      const confirmed = await confirmDialog('确定删除这条作业？');
      if (confirmed) {
        removeHomework(hw.id);
        closeModal();
        onSave();
      }
    });
  }

  content.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      title: content.querySelector('#hw-title').value.trim(),
      dueDate: content.querySelector('#hw-due').value,
      note: content.querySelector('#hw-note').value.trim(),
    };

    if (isEdit) {
      updateHomework(hw.id, data);
    } else {
      addHomework(data);
    }

    closeModal();
    onSave();
  });
}
