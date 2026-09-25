export function createEmptyState(message = '暂无内容') {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `
    <div class="empty-icon">📭</div>
    <p>${message}</p>
  `;
  return div;
}
