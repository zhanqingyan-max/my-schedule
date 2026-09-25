// 模拟 localStorage（Node.js 环境）
const localStorageData = {};
global.localStorage = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, value) => { localStorageData[key] = value; },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};

import { addTempCourse, getTempCourses, deleteTempCourse, clearAllTempCourses } from '../src/lib/tempCourses.js';
import { coursesOnWeek } from '../src/data/courses.js';

// 清理之前的测试数据
clearAllTempCourses();

// Test 1: 添加临时课程
const tempCourse = addTempCourse({
  name: '临时讲座',
  dayOfWeek: 3,
  startPeriod: 5,
  endPeriod: 6,
  startWeek: 10,
  endWeek: 10,
  classroom: '教学一号楼101',
  color: 'var(--color-temp-course)',
});

console.assert(tempCourse.id, '临时课程应有ID');
console.assert(tempCourse.isTemp === true, '临时课程应有isTemp标记');
console.assert(tempCourse.name === '临时讲座', '课程名称应正确');

// Test 2: 获取临时课程
const tempCourses = getTempCourses();
console.assert(tempCourses.length === 1, '应有1个临时课程');
console.assert(tempCourses[0].id === tempCourse.id, '临时课程ID应匹配');

// Test 3: 课程查询应包含临时课程
const week10Wed = coursesOnWeek(10, 3);
const hasTempCourse = week10Wed.some(c => c.id === tempCourse.id);
console.assert(hasTempCourse, '第10周周三应包含临时课程');

// Test 4: 其他周次不应包含临时课程
const week9Wed = coursesOnWeek(9, 3);
const hasTempCourseW9 = week9Wed.some(c => c.id === tempCourse.id);
console.assert(!hasTempCourseW9, '第9周周三不应包含临时课程');

// Test 5: 删除临时课程
deleteTempCourse(tempCourse.id);
const afterDelete = getTempCourses();
console.assert(afterDelete.length === 0, '删除后应无临时课程');

// Test 6: 添加多个临时课程
const course1 = addTempCourse({
  name: '课程1',
  dayOfWeek: 1,
  startPeriod: 1,
  endPeriod: 2,
  startWeek: 5,
  endWeek: 5,
  classroom: '',
  color: 'var(--color-temp-course)',
});

const course2 = addTempCourse({
  name: '课程2',
  dayOfWeek: 2,
  startPeriod: 3,
  endPeriod: 4,
  startWeek: 6,
  endWeek: 6,
  classroom: '',
  color: 'var(--color-temp-course)',
});

console.assert(getTempCourses().length === 2, '应有2个临时课程');

// Test 7: 清空所有临时课程
clearAllTempCourses();
console.assert(getTempCourses().length === 0, '清空后应无临时课程');

console.log('临时课程功能测试全部通过！');
