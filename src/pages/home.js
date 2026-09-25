import { dateToWeekInfo, formatCN, today } from '../lib/date.js';
import { coursesOnDate } from '../data/courses.js';
import { periodsToRange } from '../data/periods.js';
import { renderTimeline } from '../components/timeline.js';

export function renderHome(container) {
  render(container);

  // Auto-refresh every minute
  const interval = setInterval(() => {
    if (!document.hidden) {
      render(container);
    }
  }, 60000);

  // Pause when hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(interval);
    } else {
      render(container);
      // Restart interval
      const newInterval = setInterval(() => {
        if (!document.hidden) {
          render(container);
        }
      }, 60000);
      // Store for cleanup (simplified)
      container.dataset.intervalId = newInterval;
    }
  });
}

function render(container) {
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'home-page';

  const todayDate = today();
  const weekInfo = dateToWeekInfo(todayDate);

  // Date header
  const header = document.createElement('div');
  header.className = 'home-header';
  header.innerHTML = `<h1>${formatCN(todayDate)}</h1>`;
  page.appendChild(header);

  // Next class card
  const nextClassCard = createNextClassCard(todayDate);
  page.appendChild(nextClassCard);

  // Timeline
  const timelineContainer = document.createElement('div');
  timelineContainer.className = 'timeline-container';
  renderTimeline(timelineContainer, todayDate);
  page.appendChild(timelineContainer);

  container.appendChild(page);
}

function createNextClassCard(date) {
  const dateStr = date.toISOString().split('T')[0];
  const courses = coursesOnDate(dateStr);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Find next upcoming course
  const upcoming = courses
    .map(c => {
      const { start } = periodsToRange(c.startPeriod, c.endPeriod);
      const [h, m] = start.split(':').map(Number);
      return { ...c, startMinutes: h * 60 + m, startTime: start };
    })
    .filter(c => c.startMinutes > nowMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const card = document.createElement('div');
  card.className = 'next-class-card';

  if (upcoming.length === 0) {
    if (courses.length > 0) {
      card.innerHTML = `
        <div class="card-label">今日课程已全部结束</div>
      `;
    } else {
      card.innerHTML = `
        <div class="card-label">今天没有课</div>
      `;
    }
  } else {
    const next = upcoming[0];
    card.innerHTML = `
      <div class="card-label">下一节</div>
      <div class="card-name">${next.name}</div>
      <div class="card-meta">${next.startTime} · ${next.classroom || '未指定教室'}</div>
    `;
  }

  return card;
}
