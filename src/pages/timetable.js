import { dateToWeekInfo, weekRange, isHolidayWeek, formatCN, today, formatDateISO } from '../lib/date.js';
import { coursesOnWeek } from '../data/courses.js';
import { PERIOD_TIMES, periodsToRange } from '../data/periods.js';
import { showCourseDetail } from '../components/courseDetail.js';
import { showTempCourseForm, showTempCourseList } from '../components/tempCourseForm.js';
import { getTempCourses } from '../lib/tempCourses.js';

let currentWeek = null;
let currentDayView = null; // null = week view, 1-7 = day view for that day
let initialized = false;

function initWeek() {
  if (initialized) return;
  initialized = true;
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

  // Temp course action buttons
  const actionButtons = createActionButtons();
  page.appendChild(actionButtons);

  // Content
  const content = document.createElement('div');
  content.className = 'timetable-content';

  const isMobile = window.innerWidth < 768;
  const showWeekView = !isMobile || currentDayView === null;

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
  bindActionButtonsEvents(page);
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

function createActionButtons() {
  const tempCourseCount = getTempCourses().length;
  const div = document.createElement('div');
  div.className = 'temp-course-actions';
  div.innerHTML = `
    <button class="temp-course-btn" id="btn-add-temp">+ 加课</button>
    <button class="temp-course-btn" id="btn-manage-temp">
      管理临时课程${tempCourseCount > 0 ? ` (${tempCourseCount})` : ''}
    </button>
  `;
  return div;
}

function createWeekGrid() {
  const grid = document.createElement('div');
  grid.className = 'week-grid';

  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  const todayInfo = dateToWeekInfo(today());
  const todayDay = todayInfo ? todayInfo.dayOfWeek : null;
  const { mon } = weekRange(currentWeek);

  // Corner cell (row 1, col 1)
  const corner = document.createElement('div');
  corner.className = 'grid-corner';
  corner.style.gridColumn = '1';
  corner.style.gridRow = '1';
  grid.appendChild(corner);

  // Day headers with dates (row 1, cols 2-8)
  weekdays.forEach((d, i) => {
    const dayNum = i + 1;
    const isToday = dayNum === todayDay;
    const date = new Date(mon);
    date.setDate(mon.getDate() + i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

    const header = document.createElement('div');
    header.className = `grid-day-header ${isToday ? 'today' : ''}`;
    header.style.gridColumn = `${dayNum + 1}`;
    header.style.gridRow = '1';
    header.innerHTML = `<div>${d}</div><div class="header-date">${dateStr}</div>`;
    grid.appendChild(header);
  });

  // Time labels (col 1, rows 2-15)
  const sectionStarts = { 1: '上午', 6: '下午', 11: '晚上' };

  for (let period = 1; period <= 14; period++) {
    const timeLabel = document.createElement('div');
    timeLabel.className = 'grid-time-label';

    // Add section label for the first period of each section
    const sectionLabel = sectionStarts[period];
    if (sectionLabel) {
      timeLabel.innerHTML = `<div class="section-name">${sectionLabel}</div><div>${PERIOD_TIMES[period].start}</div>`;
    } else {
      timeLabel.textContent = PERIOD_TIMES[period].start;
    }

    timeLabel.style.gridColumn = '1';
    timeLabel.style.gridRow = `${period + 1}`;
    grid.appendChild(timeLabel);
  }

  // Empty cells (cols 2-8, rows 2-15)
  for (let period = 1; period <= 14; period++) {
    for (let day = 1; day <= 7; day++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.style.gridColumn = `${day + 1}`;
      cell.style.gridRow = `${period + 1}`;
      grid.appendChild(cell);
    }
  }

  // Course blocks with explicit grid positions
  for (let day = 1; day <= 7; day++) {
    const courses = coursesOnWeek(currentWeek, day);
    courses.forEach(course => {
      const block = document.createElement('div');
      block.className = `course-block ${course.isTemp ? 'temp-course' : ''}`;
      block.style.backgroundColor = course.color;
      block.style.gridColumn = `${day + 1}`;
      block.style.gridRow = `${course.startPeriod + 1} / span ${course.endPeriod - course.startPeriod + 1}`;
      block.innerHTML = `
        <div class="course-name">${course.name}</div>
        ${course.isTemp ? '<div class="temp-badge">临时</div>' : ''}
      `;
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
      const dayList = div.querySelector('.day-list');
      if (dayList) dayList.replaceWith(createDayList());
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
    card.className = `day-course-card ${course.isTemp ? 'temp-course' : ''}`;
    card.style.borderLeftColor = course.color;
    card.innerHTML = `
      <div class="card-time">${start}-${end}</div>
      <div class="card-info">
        <div class="card-name">
          ${course.name}
          ${course.isTemp ? '<span class="temp-badge">临时</span>' : ''}
        </div>
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
      if (action === 'prev') {
        if (currentWeek > 1) currentWeek--;
      } else if (action === 'next') {
        currentWeek++;
      } else if (action === 'today') {
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
      if (btn.dataset.view === 'day') {
        const weekInfo = dateToWeekInfo(today());
        currentDayView = weekInfo ? weekInfo.dayOfWeek : 1;
      } else {
        currentDayView = null;
      }
      render(page.parentElement);
    });
  });
}

function bindActionButtonsEvents(page) {
  const btnAdd = page.querySelector('#btn-add-temp');
  const btnManage = page.querySelector('#btn-manage-temp');

  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      showTempCourseForm(currentWeek, currentDayView || 1, null, () => {
        render(page.parentElement);
      });
    });
  }

  if (btnManage) {
    btnManage.addEventListener('click', () => {
      showTempCourseList(() => {
        render(page.parentElement);
      });
    });
  }
}
