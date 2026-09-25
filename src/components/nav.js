export function createNav() {
  const nav = document.createElement('nav');
  nav.className = 'app-nav';
  nav.innerHTML = `
    <a href="#/home" data-nav="/home" class="nav-item">
      <span class="nav-icon">🏠</span>
      <span class="nav-label">首页</span>
    </a>
    <a href="#/timetable" data-nav="/timetable" class="nav-item">
      <span class="nav-icon">📅</span>
      <span class="nav-label">课表</span>
    </a>
    <a href="#/todos" data-nav="/todos" class="nav-item">
      <span class="nav-icon">✓</span>
      <span class="nav-label">日程</span>
    </a>
  `;
  return nav;
}
