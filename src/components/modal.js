let currentModal = null;

export function openModal({ title, content, mode = 'center' } = {}) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = `modal modal-${mode}`;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `<h2>${title || ''}</h2><button class="modal-close" aria-label="关闭">&times;</button>`;

  const body = document.createElement('div');
  body.className = 'modal-body';
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close button
  modal.querySelector('.modal-close').addEventListener('click', closeModal);

  // Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  currentModal = { overlay, modal, escHandler };

  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
  }, 50);

  return modal;
}

export function closeModal() {
  if (currentModal) {
    currentModal.overlay.remove();
    document.removeEventListener('keydown', currentModal.escHandler);
    currentModal = null;
  }
}
