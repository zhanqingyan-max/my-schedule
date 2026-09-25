import { dateToWeekInfo, isHolidayWeek } from '../lib/date.js';
import { getTempCourses } from '../lib/tempCourses.js';

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
    id: 'math-physics-french',
    name: '数理基础法语(1)',
    color: 'var(--color-course-4)',
    dayOfWeek: 1,
    startPeriod: 1,
    endPeriod: 2,
    startWeek: 10,
    endWeek: 19,
    classroom: '教学一号楼',
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
    note: '具体课程待确认',
  },
  {
    id: 'multi-class-wed-w12',
    name: '多节课',
    color: 'var(--color-course-1)',
    dayOfWeek: 3,
    startPeriod: 7,
    endPeriod: 9,
    startWeek: 12,
    endWeek: 12,
    classroom: '',
    note: '仅第12周',
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
    color: 'var(--color-course-2)',
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
    endPeriod: 4,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学二号楼',
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
    startWeek: 3,
    endWeek: 10,
    classroom: '科研一号楼1040',
  },
  {
    id: 'national-security',
    name: '国家安全(1)',
    color: 'var(--color-course-1)',
    dayOfWeek: 3,
    startPeriod: 6,
    endPeriod: 7,
    startWeek: 6,
    endWeek: 10,
    classroom: '科研一号楼',
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
  },
  {
    id: 'french-comprehensive-1-thu-evening',
    name: '综合法语(1)',
    color: 'var(--color-course-3)',
    dayOfWeek: 4,
    startPeriod: 11,
    endPeriod: 12,
    startWeek: 6,
    endWeek: 19,
    classroom: '教学一号楼',
  },
  {
    id: 'computer-basics-mon',
    name: '大学计算机基础',
    color: 'var(--color-course-4)',
    dayOfWeek: 1,
    startPeriod: 8,
    endPeriod: 10,
    startWeek: 4,
    endWeek: 17,
    classroom: '教学二号楼',
  },
  {
    id: 'computer-basics-fri',
    name: '大学计算机基础',
    color: 'var(--color-course-4)',
    dayOfWeek: 5,
    startPeriod: 8,
    endPeriod: 10,
    startWeek: 4,
    endWeek: 17,
    classroom: '教学二号楼',
  },
  {
    id: 'chinese-red-songs',
    name: '中国红色歌曲赏析与实践',
    color: 'var(--color-course-2)',
    dayOfWeek: 3,
    startPeriod: 11,
    endPeriod: 12,
    startWeek: 1,
    endWeek: 19,
    classroom: '科研一号楼5058',
  },
  {
    id: 'french-practical-computer',
    name: '计算机综合法语实训(1)',
    color: 'var(--color-course-3)',
    dayOfWeek: 4,
    startPeriod: 5,
    endPeriod: 5,
    startWeek: 1,
    endWeek: 19,
    classroom: '教学1号楼B1001',
  },
  {
    id: 'chemistry-experiment-w3',
    name: '化学实验：茶叶中微量元素的鉴定与定量测定',
    color: 'var(--color-course-2)',
    dayOfWeek: 2,
    startPeriod: 11,
    endPeriod: 14,
    startWeek: 3,
    endWeek: 3,
    classroom: '化学实验室',
  },
  {
    id: 'chemistry-experiment-w11',
    name: '化学实验：基于低维纳米高导电电磁屏蔽材料的设计制备与表征',
    color: 'var(--color-course-2)',
    dayOfWeek: 2,
    startPeriod: 11,
    endPeriod: 14,
    startWeek: 11,
    endWeek: 11,
    classroom: '化学实验室',
  },
  {
    id: 'engineering-recognition-w2',
    name: '工程认识：特种加工',
    color: 'var(--color-course-4)',
    dayOfWeek: 1,
    startPeriod: 2,
    endPeriod: 5,
    startWeek: 2,
    endWeek: 2,
    classroom: '科研一号楼B1036实验室',
  },
  {
    id: 'engineering-recognition-w3',
    name: '工程认识：3D技术与机器人',
    color: 'var(--color-course-4)',
    dayOfWeek: 1,
    startPeriod: 2,
    endPeriod: 5,
    startWeek: 3,
    endWeek: 3,
    classroom: '科研一号楼B1043实验室',
  },
  {
    id: 'engineering-recognition-w4-virtual',
    name: '工程认识：虚拟仿真',
    color: 'var(--color-course-4)',
    dayOfWeek: 1,
    startPeriod: 2,
    endPeriod: 3,
    startWeek: 4,
    endWeek: 4,
    classroom: '科研一号楼B1041实验室',
  },
  {
    id: 'engineering-recognition-w4-embedded',
    name: '工程认识：嵌入式系统',
    color: 'var(--color-course-4)',
    dayOfWeek: 1,
    startPeriod: 4,
    endPeriod: 5,
    startWeek: 4,
    endWeek: 4,
    classroom: '科研一号楼B1018实验室',
  },
  {
    id: 'engineering-recognition-w6',
    name: '工程认识：精密铸造',
    color: 'var(--color-course-4)',
    dayOfWeek: 1,
    startPeriod: 2,
    endPeriod: 5,
    startWeek: 6,
    endWeek: 6,
    classroom: '科研一号楼B1044实验室',
  },
];

export function coursesOnDate(dateStr) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay() || 7; // 周日=7
  const weekInfo = dateToWeekInfo(dateStr);
  if (!weekInfo) return [];
  if (isHolidayWeek(weekInfo.week)) return [];

  const baseCourses = COURSES.filter(c =>
    c.dayOfWeek === dayOfWeek &&
    c.startWeek <= weekInfo.week &&
    c.endWeek >= weekInfo.week
  );

  // 获取临时课程
  const tempCourses = getTempCourses().filter(c =>
    c.dayOfWeek === dayOfWeek &&
    c.startWeek <= weekInfo.week &&
    c.endWeek >= weekInfo.week
  );

  // 过滤掉被临时课程覆盖的正式课程（相同时间段）
  const filteredBase = baseCourses.filter(base =>
    !tempCourses.some(temp =>
      temp.startPeriod <= base.endPeriod &&
      temp.endPeriod >= base.startPeriod
    )
  );

  return [...filteredBase, ...tempCourses];
}

export function coursesOnWeek(week, dayOfWeek) {
  if (isHolidayWeek(week)) return [];
  
  const baseCourses = COURSES.filter(c =>
    c.dayOfWeek === dayOfWeek &&
    c.startWeek <= week &&
    c.endWeek >= week
  );

  // 获取临时课程
  const tempCourses = getTempCourses().filter(c =>
    c.dayOfWeek === dayOfWeek &&
    c.startWeek <= week &&
    c.endWeek >= week
  );

  // 过滤掉被临时课程覆盖的正式课程（相同时间段）
  const filteredBase = baseCourses.filter(base =>
    !tempCourses.some(temp =>
      temp.startPeriod <= base.endPeriod &&
      temp.endPeriod >= base.startPeriod
    )
  );

  return [...filteredBase, ...tempCourses];
}
