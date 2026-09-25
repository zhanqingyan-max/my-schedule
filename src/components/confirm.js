import { openModal, closeModal } from './modal.js';

export function confirmDialog(text) {
  return new Promise((resolve) => {
    const content = document.createElement('div');
    content.className = 'confirm-content';
    content.innerHTML = `
      <p>${text}</p>
      <div class="confirm-actions">
        <button class="btn btn-secondary" data-action="cancel">取消</button>
        <button class="btn btn-danger" data-action="confirm">确认</button>
      </div>
    `;

    openModal({ content, mode: 'center' });

    content.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      closeModal();
      resolve(false);
    });

    content.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      closeModal();
      resolve(true);
    });
  });
}
