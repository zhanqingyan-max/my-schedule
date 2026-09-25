import { SEMESTER1_WEEK1_MONDAY, SEMESTER1_TOTAL_WEEKS, HOLIDAY_WEEKS } from '../data/calendar.js';

const WEEK1_MONDAY = SEMESTER1_WEEK1_MONDAY; // Already a Date object

export function dateToWeekInfo(date) {
  const d = normalizeDate(date);
  const diffDays = Math.floor((d - WEEK1_MONDAY) / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  const dayOfWeek = d.getDay() || 7; // 周日=7

  if (week < 1 || week > SEMESTER1_TOTAL_WEEKS) return null;
  return { week, dayOfWeek, date: d };
}

export function weekRange(week) {
  const mon = new Date(WEEK1_MONDAY);
  mon.setDate(mon.getDate() + (week - 1) * 7);
  const sun = new Date(mon);
  sun.setDate(sun.getDate() + 6);
  return { mon, sun };
}

export function isHolidayWeek(week) {
  return HOLIDAY_WEEKS.has(week);
}

export function formatCN(date) {
  const d = normalizeDate(date);
  const weekInfo = dateToWeekInfo(d);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[d.getDay()];
  const weekStr = weekInfo ? ` · 第${weekInfo.week}周` : '';
  return `${month}月${day}日 周${weekday}${weekStr}`;
}

export function today() {
  return new Date();
}

export function normalizeDate(date) {
  if (typeof date === 'string') {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isSameDay(a, b) {
  const da = normalizeDate(a);
  const db = normalizeDate(b);
  return da.getTime() === db.getTime();
}
