import { dateToWeekInfo, weekRange, isHolidayWeek, formatCN, today, formatDateISO } from '../lib/date.js';
import { coursesOnWeek } from '../data/courses.js';
import { PERIOD_TIMES, periodsToRange } from '../data/periods.js';
import { showCourseDetail } from '../components/courseDetail.js';

let currentWeek = null;
let currentDayView = 1; // 1-7, Monday-Sunday

function initWeek() {
  const weekInfo = dateToWeekInfo(today());
  currentWeek = weekInfo ? weekInfo.week : 1;
  currentDayView = weekInfo ? weekInfo.dayOfWeek : 1;
}

export function renderTimetable(container) {
  initWeek();
  render(container);
}

function render(container) {
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'timetable-page';

  // Week switcher
  const weekSwitcher = createWeekSwitcher();
  page.appendChild(weekSwitcher);

  // View toggle (mobile only)
  const viewToggle = createViewToggle();
  page.appendChild(viewToggle);

  // Content
  const content = document.createElement('div');
  content.className = 'timetable-content';

  const isMobile = window.innerWidth < 768;
  const showWeekView = !isMobile || !page.dataset.dayView;

  if (showWeekView) {
    content.appendChild(createWeekGrid());
  } else {
    content.appendChild(createDayView());
  }

  page.appendChild(content);
  container.appendChild(page);

  // Bind events
  bindWeekSwitcherEvents(page);
  bindViewToggleEvents(page);
}

function createWeekSwitcher() {
  const { mon, sun } = weekRange(currentWeek);
  const holidayTag = isHolidayWeek(currentWeek) ? ' <span class="holiday-tag">假期</span>' : '';

  const div = document.createElement('div');
  div.className = 'week-switcher';
  div.innerHTML = `
    <button class="week-nav-btn" data-action="prev">‹</button>
    <div class="week-label">
      <span>第${currentWeek}周</span>
      <span class="week-date">${mon.getMonth()+1}.${mon.getDate()}–${sun.getMonth()+1}.${sun.getDate()}</span>
      ${holidayTag}
    </div>
    <button class="week-nav-btn" data-action="next">›</button>
    <button class="week-nav-btn week-today-btn" data-action="today">本周</button>
  `;
  return div;
}

function createViewToggle() {
  const div = document.createElement('div');
  div.className = 'view-toggle';
  div.innerHTML = `
    <button class="view-btn" data-view="week">周</button>
    <button class="view-btn" data-view="day">日</button>
  `;
  return div;
}

function createWeekGrid() {
  const grid = document.createElement('div');
  grid.className = 'week-grid';

  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  const todayInfo = dateToWeekInfo(today());
  const todayDay = todayInfo ? todayInfo.dayOfWeek : null;

  // Corner cell
  const corner = document.createElement('div');
  corner.className = 'grid-corner';
  grid.appendChild(corner);

  // Day headers
  weekdays.forEach((d, i) => {
    const dayNum = i + 1;
    const isToday = dayNum === todayDay;
    const header = document.createElement('div');
    header.className = `grid-day-header ${isToday ? 'today' : ''}`;
    header.textContent = d;
    grid.appendChild(header);
  });

  // Time labels and cells for each period
  for (let period = 1; period <= 14; period++) {
    const timeLabel = document.createElement('div');
    timeLabel.className = 'grid-time-label';
    timeLabel.textContent = PERIOD_TIMES[period].start;
    grid.appendChild(timeLabel);

    for (let day = 1; day <= 7; day++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.day = day;
      cell.dataset.period = period;
      grid.appendChild(cell);
    }
  }

  // Add course blocks as direct children of grid
  for (let day = 1; day <= 7; day++) {
    const courses = coursesOnWeek(currentWeek, day);
    courses.forEach(course => {
      const block = document.createElement('div');
      block.className = 'course-block';
      block.style.backgroundColor = course.color;
      // Grid column: day + 1 (because first column is time labels)
      block.style.gridColumn = day + 1;
      // Grid row: period + 1 (because first row is headers)
      block.style.gridRow = `${course.startPeriod + 1} / span ${course.endPeriod - course.startPeriod + 1}`;
      block.innerHTML = `<div class="course-name">${course.name}</div>`;
      block.addEventListener('click', () => showCourseDetail(course));
      grid.appendChild(block);
    });
  }

  return grid;
}

function createDayView() {
  const div = document.createElement('div');
  div.className = 'day-view';

  // Day chips
  const chips = document.createElement('div');
  chips.className = 'day-chips';
  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  const todayInfo = dateToWeekInfo(today());
  const todayDay = todayInfo ? todayInfo.dayOfWeek : null;

  weekdays.forEach((d, i) => {
    const dayNum = i + 1;
    const chip = document.createElement('button');
    chip.className = `day-chip ${dayNum === currentDayView ? 'active' : ''} ${dayNum === todayDay ? 'today' : ''}`;
    chip.textContent = d;
    chip.addEventListener('click', () => {
      currentDayView = dayNum;
      div.querySelector('.day-list').replaceWith(createDayList());
      chips.querySelectorAll('.day-chip').forEach((c, idx) => {
        c.classList.toggle('active', idx + 1 === dayNum);
      });
    });
    chips.appendChild(chip);
  });
  div.appendChild(chips);

  // Day list
  div.appendChild(createDayList());

  return div;
}

function createDayList() {
  const list = document.createElement('div');
  list.className = 'day-list';

  const courses = coursesOnWeek(currentWeek, currentDayView);

  if (courses.length === 0) {
    list.innerHTML = '<div class="empty-day">今天没有课</div>';
    return list;
  }

  courses.forEach(course => {
    const { start, end } = periodsToRange(course.startPeriod, course.endPeriod);
    const periodLabel = course.startPeriod === course.endPeriod
      ? `第${course.startPeriod}节`
      : `第${course.startPeriod}-${course.endPeriod}节`;

    const card = document.createElement('div');
    card.className = 'day-course-card';
    card.style.borderLeftColor = course.color;
    card.innerHTML = `
      <div class="card-time">${start}-${end}</div>
      <div class="card-info">
        <div class="card-name">${course.name}</div>
        <div class="card-location">${course.classroom || ''} · ${periodLabel}</div>
      </div>
    `;
    card.addEventListener('click', () => showCourseDetail(course));
    list.appendChild(card);
  });

  return list;
}

function bindWeekSwitcherEvents(page) {
  page.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'prev') currentWeek--;
      else if (action === 'next') currentWeek++;
      else if (action === 'today') {
        const weekInfo = dateToWeekInfo(today());
        currentWeek = weekInfo ? weekInfo.week : 1;
      }
      render(page.parentElement);
    });
  });
}

function bindViewToggleEvents(page) {
  page.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      page.dataset.dayView = btn.dataset.view === 'day' ? 'true' : '';
      render(page.parentElement);
    });
  });
}
