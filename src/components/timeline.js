import { coursesOnDate } from '../data/courses.js';
import { listAll, toggleDone } from '../lib/todoStore.js';
import { periodsToRange } from '../data/periods.js';
import { formatCN, today, formatDateISO, isSameDay } from '../lib/date.js';
import { navigate } from '../router.js';

export function renderTimeline(container, date = today()) {
  container.innerHTML = '';

  const dateStr = formatDateISO(date);
  const courses = coursesOnDate(dateStr);
  const todos = listAll().filter(t => t.date && isSameDay(new Date(t.date), date));

  // Build timeline items
  const items = [];

  courses.forEach(course => {
    const { start, end } = periodsToRange(course.startPeriod, course.endPeriod);
    items.push({
      type: 'course',
      time: start,
      endTime: end,
      course,
      sortKey: course.startPeriod,
    });
  });

  todos.forEach(todo => {
    const time = todo.startTime || '00:00';
    items.push({
      type: 'todo',
      time,
      endTime: todo.endTime,
      todo,
      sortKey: todo.startTime ? parseInt(todo.startTime.replace(':', '')) : 9999,
    });
  });

  // Sort by time
  items.sort((a, b) => a.sortKey - b.sortKey);

  if (items.length === 0) {
    container.innerHTML = '<div class="empty-timeline">今天没有课，也没有安排 🎈</div>';
    return;
  }

  const timeline = document.createElement('div');
  timeline.className = 'timeline';

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'timeline-item';

    const [h, m] = item.time.split(':').map(Number);
    const itemMinutes = h * 60 + m;
    const [endH, endM] = (item.endTime || item.time).split(':').map(Number);
    const endMinutes = endH * 60 + endM;

    let status = 'future';
    if (endMinutes < nowMinutes) status = 'past';
    else if (itemMinutes <= nowMinutes && nowMinutes <= endMinutes) status = 'current';

    el.classList.add(status);

    if (item.type === 'course') {
      el.innerHTML = `
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-dot"></div>
        <div class="timeline-content course-content" style="border-left-color:${item.course.color}">
          <div class="timeline-title">${item.course.name}</div>
          <div class="timeline-meta">${item.course.classroom || ''} · 第${item.course.startPeriod}-${item.course.endPeriod}节</div>
        </div>
      `;
      el.addEventListener('click', () => {
        navigate('/timetable');
      });
    } else {
      el.innerHTML = `
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-dot"></div>
        <div class="timeline-content todo-content ${item.todo.done ? 'done' : ''}">
          <input type="checkbox" ${item.todo.done ? 'checked' : ''} />
          <div class="timeline-title">${item.todo.title}</div>
        </div>
      `;
      el.querySelector('input').addEventListener('change', (e) => {
        e.stopPropagation();
        toggleDone(item.todo.id);
        renderTimeline(container, date);
      });
      el.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          navigate('/todos');
        }
      });
    }

    timeline.appendChild(el);
  });

  container.appendChild(timeline);
}
