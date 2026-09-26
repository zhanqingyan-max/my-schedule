import { openModal, closeModal } from './modal.js';
import { confirmDialog } from './confirm.js';
import { addBirthday, updateBirthday, removeBirthday } from '../lib/birthdayStore.js';

export function openBirthdayForm(birthday = null, onSave) {
  const isEdit = birthday !== null;

  const content = document.createElement('form');
  content.className = 'birthday-form';
  content.innerHTML = `
    <div class="form-group">
      <label for="birthday-name">姓名 *</label>
      <input type="text" id="birthday-name" required value="${isEdit ? birthday.name : ''}" />
    </div>
    <div class="form-group">
      <label for="birthday-date">生日 *</label>
      <input type="date" id="birthday-date" required value="${isEdit ? birthday.date : ''}" />
    </div>
    <div class="form-group">
      <label for="birthday-note">备注</label>
      <input type="text" id="birthday-note" value="${isEdit && birthday.note ? birthday.note : ''}" placeholder="选填，如关系、礼物想法等" />
    </div>
    <div class="form-actions">
      ${isEdit ? '<button type="button" class="btn btn-danger" data-action="delete">删除</button>' : ''}
      <button type="button" class="btn btn-secondary" data-action="cancel">取消</button>
      <button type="submit" class="btn btn-primary">${isEdit ? '保存' : '添加'}</button>
    </div>
  `;

  openModal({ title: isEdit ? '编辑生日' : '添加生日', content, mode: 'sheet' });

  content.querySelector('[data-action="cancel"]').addEventListener('click', closeModal);

  if (isEdit) {
    content.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      const confirmed = await confirmDialog(`确定删除 ${birthday.name} 的生日？`);
      if (confirmed) {
        removeBirthday(birthday.id);
        closeModal();
        onSave();
      }
    });
  }

  content.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: content.querySelector('#birthday-name').value.trim(),
      date: content.querySelector('#birthday-date').value,
      note: content.querySelector('#birthday-note').value.trim(),
    };

    if (isEdit) {
      updateBirthday(birthday.id, data);
    } else {
      addBirthday(data);
    }

    closeModal();
    onSave();
  });
}
