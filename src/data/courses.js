import { dateToWeekInfo } from '../lib/date.js';

// 课程种子数据（PRD §5.3）
// 待确认项已标注 note 字段

export const COURSES = [
  {
    id: 'math-foundation',
    name: '数学基础',
    color: 'var(--color-course-1)',
    dayOfWeek: 2,
    startPeriod: 1,
    endPeriod: 2,
    startWeek: 1,
    endWeek: 19,
    classroom: '科研一号楼',
  },
  {
    id: 'multi-class-tue',
    name: '多节课',
    color: 'var(--color-course-3)',
    dayOfWeek: 2,
    startPeriod: 3,
    endPeriod: 4,
    startWeek: 1,
    endWeek: 19,
    classroom: '',
    note: '待用户补充具体课程与单双周安排',
  },
  {
    id: 'french-comprehensive-1-mon',
    name: '综合法语(1)',
    color: 'var(--color-course-1)',
    dayOfWeek: 1,
    startPeriod: 6,
    endPeriod: 7,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学一号楼',
  },
  {
    id: 'french-comprehensive-1-tue',
    name: '综合法语(1)',
    color: 'var(--color-course-1)',
    dayOfWeek: 2,
    startPeriod: 6,
    endPeriod: 7,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学一号楼',
  },
  {
    id: 'french-comprehensive-1-wed',
    name: '综合法语(1)',
    color: 'var(--color-course-1)',
    dayOfWeek: 3,
    startPeriod: 3,
    endPeriod: 4,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学一号楼',
  },
  {
    id: 'french-practical',
    name: '综合法语实训(1)',
    color: 'var(--color-course-3)',
    dayOfWeek: 4,
    startPeriod: 3,
    endPeriod: 5,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学二号楼',
    note: '第 5 节暂按连堂录入，待确认',
  },
  {
    id: 'pe-1',
    name: '体育(1)',
    color: 'var(--color-course-4)',
    dayOfWeek: 2,
    startPeriod: 8,
    endPeriod: 9,
    startWeek: 1,
    endWeek: 19,
    classroom: '杭州田径场',
  },
  {
    id: 'xi-jinping-thought',
    name: '习近平新时代中国特色社会主义思想概论',
    color: 'var(--color-course-1)',
    dayOfWeek: 4,
    startPeriod: 6,
    endPeriod: 9,
    startWeek: 1,
    endWeek: 19,
    classroom: '科研一号楼',
    note: '全称暂用，待确认',
  },
  {
    id: 'aerospace-intro',
    name: '航空航天概论A',
    color: 'var(--color-course-4)',
    dayOfWeek: 5,
    startPeriod: 1,
    endPeriod: 2,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学一号楼',
  },
  {
    id: 'basic-english',
    name: '基础英语(1)',
    color: 'var(--color-course-4)',
    dayOfWeek: 5,
    startPeriod: 4,
    endPeriod: 5,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学一号楼',
  },
  {
    id: 'modern-chinese-history',
    name: '中国近现代史纲要',
    color: 'var(--color-course-2)',
    dayOfWeek: 3,
    startPeriod: 11,
    endPeriod: 12,
    startWeek: 1,
    endWeek: 19,
    classroom: '科研一号楼',
    note: '全称暂用，具体星期待确认（周三/周四）',
  },
  {
    id: 'french-comprehensive-1-thu-evening',
    name: '综合法语(1)',
    color: 'var(--color-course-3)',
    dayOfWeek: 4,
    startPeriod: 11,
    endPeriod: 12,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学一号楼',
  },
  {
    id: 'engineering-intro',
    name: '工程认识',
    color: 'var(--color-course-2)',
    dayOfWeek: 1,
    startPeriod: 2,
    endPeriod: 5,
    startWeek: 2,
    endWeek: 4,
    classroom: '',
    note: '起止周暂录 2-4 周，待确认',
  },
  {
    id: 'computer-basics',
    name: '大学计算机基础',
    color: 'var(--color-course-4)',
    dayOfWeek: 1,
    startPeriod: 8,
    endPeriod: 10,
    startWeek: 4,
    endWeek: 12,
    classroom: '教学二号楼',
    note: '起止周暂录 4-12 周，待确认',
  },
  {
    id: 'computer-basics-fri',
    name: '大学计算机基础',
    color: 'var(--color-course-4)',
    dayOfWeek: 5,
    startPeriod: 8,
    endPeriod: 10,
    startWeek: 4,
    endWeek: 12,
    classroom: '教学二号楼',
    note: '起止周暂录 4-12 周，待确认',
  },
];

export function coursesOnDate(dateStr) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay() || 7; // 周日=7
  const weekInfo = dateToWeekInfo(dateStr);
  if (!weekInfo) return [];

  return COURSES.filter(c =>
    c.dayOfWeek === dayOfWeek &&
    c.startWeek <= weekInfo.week &&
    c.endWeek >= weekInfo.week
  );
}

export function coursesOnWeek(week, dayOfWeek) {
  return COURSES.filter(c =>
    c.dayOfWeek === dayOfWeek &&
    c.startWeek <= week &&
    c.endWeek >= week
  );
}
