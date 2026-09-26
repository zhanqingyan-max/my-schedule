import { dateToWeekInfo, formatCN, today, formatDateISO } from '../lib/date.js';
import { coursesOnDate } from '../data/courses.js';
import { periodsToRange } from '../data/periods.js';
import { renderTimeline } from '../components/timeline.js';
import { openModal, closeModal } from '../components/modal.js';
import { getHolidayOnDate, getLunarDate, getHolidayDecorationSVG } from '../data/calendar.js';
import { listBirthdays, getBirthdaysOnDate, getNextBirthday } from '../lib/birthdayStore.js';
import { openBirthdayForm } from '../components/birthdayForm.js';
import { getPendingHomeworks, getCompletedHomeworks, toggleHomeworkDone, removeHomework } from '../lib/homeworkStore.js';
import { openHomeworkForm } from '../components/homeworkForm.js';

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
  const dateStr = formatDateISO(todayDate);

  // Date header with holiday/lunar info
  const header = document.createElement('div');
  header.className = 'home-header';
  const holidayName = getHolidayOnDate(dateStr);
  const lunarDate = getLunarDate(dateStr);
  const lunarLabel = lunarDate?.label;
  // Avoid showing the same name twice (e.g., 中秋节 appears in both holiday and lunar)
  const showLunar = lunarLabel && lunarLabel !== holidayName;
  const lunarStr = showLunar ? ` · ${lunarLabel}` : '';
  const holidayStr = holidayName ? ` · ${holidayName}` : '';

  // Holiday/lunar decoration
  const decoSVG = getHolidayDecorationSVG(dateStr);

  header.innerHTML = `
    <h1>${formatCN(todayDate)}${holidayStr}${lunarStr}</h1>
    <div class="header-scene">
      ${decoSVG ? `<div class="holiday-deco">${decoSVG}</div>` : ''}
      <div class="ink-cat" title="嗷呜~">
        <svg viewBox="0 0 64 64" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="32" cy="46" rx="15" ry="12" fill="#C8C2BA" opacity="0.7"/>
          <ellipse cx="32" cy="44" rx="13" ry="10" fill="#D5D0CA" opacity="0.5"/>
          <ellipse cx="32" cy="26" rx="13" ry="12" fill="#C8C2BA" opacity="0.75"/>
          <ellipse cx="32" cy="24" rx="11" ry="10" fill="#D5D0CA" opacity="0.45"/>
          <polygon points="20,18 21,4 27,16" fill="#B8B0A6" opacity="0.7"/>
          <polygon points="37,16 43,4 44,18" fill="#B8B0A6" opacity="0.7"/>
          <polygon points="22,16 22.5,7 26,16" fill="#E8B4B8" opacity="0.3"/>
          <polygon points="38,16 41.5,7 42,17" fill="#E8B4B8" opacity="0.3"/>
          <path d="M24 23 Q26 20 28 23" stroke="#5C5C5C" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.55"/>
          <path d="M36 23 Q38 20 40 23" stroke="#5C5C5C" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.55"/>
          <ellipse cx="32" cy="28" rx="2.5" ry="1.8" fill="#5C5C5C" opacity="0.55"/>
          <ellipse cx="32" cy="32" rx="4.5" ry="3.5" fill="#5C5C5C" opacity="0.45"/>
          <ellipse cx="32" cy="33" rx="2.5" ry="2" fill="#E89080" opacity="0.5"/>
          <circle cx="24" cy="27" r="3" fill="#E8B4B8" opacity="0.15"/>
          <circle cx="40" cy="27" r="3" fill="#E8B4B8" opacity="0.15"/>
          <ellipse cx="26" cy="46" rx="5" ry="4" fill="#B8B0A6" opacity="0.45"/>
          <ellipse cx="38" cy="46" rx="5" ry="4" fill="#B8B0A6" opacity="0.45"/>
          <path d="M46 42 Q58 34 54 22" stroke="#B8B0A6" stroke-width="6" fill="none" opacity="0.5" stroke-linecap="round"/>
          <path d="M48 40 Q56 34 53 24" stroke="#C8C2BA" stroke-width="3.5" fill="none" opacity="0.35" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  `;

  // Cat click interaction
  const catEl = header.querySelector('.ink-cat');
  const meows = ['嗷呜~', '~', '呜~', '嚎~', '', '蹭蹭~'];
  catEl.addEventListener('click', () => {
    const bubble = document.createElement('div');
    bubble.className = 'cat-meow';
    bubble.textContent = meows[Math.floor(Math.random() * meows.length)];
    catEl.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1200);
  });

  page.appendChild(header);

  // Today's birthdays
  const todayBirthdays = getBirthdaysOnDate(todayDate.getMonth() + 1, todayDate.getDate());
  if (todayBirthdays.length > 0) {
    page.appendChild(createBirthdaySection(todayBirthdays, true));
  }

  // Upcoming birthdays (next 7 days)
  const upcomingBirthdays = getUpcomingBirthdays(todayDate, 7);
  if (upcomingBirthdays.length > 0) {
    page.appendChild(createBirthdaySection(upcomingBirthdays, false));
  }

  // Show manage button only if no birthdays at all
  const allBirthdays = listBirthdays();
  if (allBirthdays.length === 0) {
    const birthdayBtn = document.createElement('button');
    birthdayBtn.className = 'birthday-manage-btn';
    birthdayBtn.textContent = '添加第一个生日';
    birthdayBtn.addEventListener('click', () => openBirthdayManager(() => render(container)));
    page.appendChild(birthdayBtn);
  }

  // Next class card
  const nextClassCard = createNextClassCard(todayDate);
  page.appendChild(nextClassCard);

  // Homework section
  const homeworkSection = createHomeworkSection(() => render(container));
  page.appendChild(homeworkSection);

  // Timeline
  const timelineContainer = document.createElement('div');
  timelineContainer.className = 'timeline-container';
  renderTimeline(timelineContainer, todayDate);
  page.appendChild(timelineContainer);

  container.appendChild(page);
}

function getUpcomingBirthdays(fromDate, days) {
  const allBirthdays = listBirthdays();
  const results = [];
  const from = new Date(fromDate);

  allBirthdays.forEach(b => {
    const next = getNextBirthday(b, from);
    if (next.diffDays > 0 && next.diffDays <= days) {
      results.push({ ...b, ...next });
    }
  });

  results.sort((a, b) => a.diffDays - b.diffDays);
  return results;
}

function createBirthdaySection(birthdays, isToday) {
  const section = document.createElement('div');
  section.className = 'birthday-section';

  // Header with title and manage button
  const header = document.createElement('div');
  header.className = 'birthday-section-header';

  const title = document.createElement('div');
  title.className = 'birthday-section-title';
  title.textContent = isToday ? '今日生日' : '近期生日';
  header.appendChild(title);

  const manageBtn = document.createElement('button');
  manageBtn.className = 'birthday-manage-icon-btn';
  manageBtn.innerHTML = '⚙';
  manageBtn.title = '管理生日';
  manageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openBirthdayManager(() => render(container));
  });
  header.appendChild(manageBtn);

  section.appendChild(header);

  const list = document.createElement('div');
  list.className = 'birthday-list';

  birthdays.forEach(b => {
    const item = document.createElement('div');
    item.className = 'birthday-item';

    const parts = b.date.split('-');
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    const dateStr = `${month}月${day}日`;

    let infoStr = '';
    if (isToday) {
      // 今日生日：显示"今天 · XX岁"
      const ageStr = b.age ? `${b.age}岁` : '';
      infoStr = ageStr ? `今天 · ${ageStr}` : '今天';
    } else {
      // 近期生日：显示"X月X日 · X天后 · XX岁"
      const diffStr = b.diffDays ? `${b.diffDays}天后` : '';
      const ageStr = b.age ? `${b.age}岁` : '';
      const parts = [];
      if (diffStr) parts.push(diffStr);
      if (ageStr) parts.push(ageStr);
      infoStr = parts.join(' · ');
    }

    item.innerHTML = `
      <span class="birthday-icon">🎂</span>
      <div class="birthday-item-content">
        <div class="birthday-name">${b.name}</div>
        <div class="birthday-meta">${dateStr}${infoStr ? ' · ' + infoStr : ''}</div>
      </div>
    `;

    item.addEventListener('click', () => openBirthdayForm(b, () => {
      const page = item.closest('.home-page');
      if (page) render(page.parentElement);
    }));
    list.appendChild(item);
  });

  section.appendChild(list);
  return section;
}

function openBirthdayManager(onSave) {
  const birthdays = listBirthdays();
  const content = document.createElement('div');
  content.className = 'birthday-manager';

  if (birthdays.length === 0) {
    content.innerHTML = '<div class="empty-state">还没有添加生日，点击下方按钮添加</div>';
  } else {
    birthdays.forEach(b => {
      const item = document.createElement('div');
      item.className = 'birthday-manager-item';
      const parts = b.date.split('-');
      item.innerHTML = `
        <div class="birthday-manager-info">
          <span class="birthday-manager-name">${b.name}</span>
          <span class="birthday-manager-date">${parts[1]}月${parts[2]}日</span>
        </div>
      `;
      item.addEventListener('click', () => {
        closeModal();
        openBirthdayForm(b, () => {
          onSave();
        });
      });
      content.appendChild(item);
    });
  }

  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-primary birthday-add-btn';
  addBtn.textContent = '+ 添加生日';
  addBtn.addEventListener('click', () => {
    closeModal();
    openBirthdayForm(null, () => {
      onSave();
    });
  });
  content.appendChild(addBtn);

  openModal({ title: '生日管理', content, mode: 'sheet' });
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

function createHomeworkSection(onSave) {
  const section = document.createElement('div');
  section.className = 'homework-section';

  const header = document.createElement('div');
  header.className = 'homework-section-header';

  const title = document.createElement('div');
  title.className = 'homework-section-title';
  title.textContent = '作业';
  header.appendChild(title);

  const addBtn = document.createElement('button');
  addBtn.className = 'homework-add-btn';
  addBtn.textContent = '+ 添加';
  addBtn.addEventListener('click', () => openHomeworkForm(null, onSave));
  header.appendChild(addBtn);

  section.appendChild(header);

  const pending = getPendingHomeworks();
  const completed = getCompletedHomeworks();

  if (pending.length === 0 && completed.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'homework-empty';
    empty.textContent = '暂无作业';
    section.appendChild(empty);
    return section;
  }

  const list = document.createElement('div');
  list.className = 'homework-list';

  const renderHw = (hw) => {
    const item = document.createElement('div');
    item.className = `homework-item${hw.done ? ' done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = hw.done;
    checkbox.addEventListener('change', () => {
      toggleHomeworkDone(hw.id);
      onSave();
    });

    const content = document.createElement('div');
    content.className = 'homework-item-content';

    const titleEl = document.createElement('div');
    titleEl.className = 'homework-title';
    titleEl.textContent = hw.title;

    const parts = hw.dueDate.split('-');
    const dueStr = `${parseInt(parts[1])}月${parseInt(parts[2])}日`;
    const todayStr = formatDateISO(today());
    const isOverdue = !hw.done && hw.dueDate < todayStr;

    const meta = document.createElement('div');
    meta.className = `homework-meta${isOverdue ? ' overdue' : ''}`;
    meta.textContent = dueStr + (hw.note ? ` · ${hw.note}` : '');

    content.appendChild(titleEl);
    content.appendChild(meta);

    const delBtn = document.createElement('button');
    delBtn.className = 'homework-del-btn';
    delBtn.textContent = '×';
    delBtn.title = '删除';
    delBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const { confirmDialog } = await import('../components/confirm.js');
      const ok = await confirmDialog('确定删除这条作业？');
      if (ok) {
        removeHomework(hw.id);
        onSave();
      }
    });

    item.appendChild(checkbox);
    item.appendChild(content);
    item.appendChild(delBtn);

    item.addEventListener('click', (e) => {
      if (e.target === checkbox || e.target === delBtn) return;
      openHomeworkForm(hw, onSave);
    });

    return item;
  };

  pending.forEach(hw => list.appendChild(renderHw(hw)));
  completed.forEach(hw => list.appendChild(renderHw(hw)));

  section.appendChild(list);
  return section;
}
