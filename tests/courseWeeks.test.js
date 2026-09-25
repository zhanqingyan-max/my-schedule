// 模拟 localStorage（Node.js 环境）
const localStorageData = {};
global.localStorage = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, value) => { localStorageData[key] = value; },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};

import { coursesOnWeek } from '../src/data/courses.js';

// Test 1: 习近平课程第3周应该有
const xiW3 = coursesOnWeek(3, 4).find(c => c.id === 'xi-jinping-thought');
console.assert(xiW3, '第3周周四应有习近平课程');

// Test 2: 习近平课程第2周不应该有
const xiW2 = coursesOnWeek(2, 4).find(c => c.id === 'xi-jinping-thought');
console.assert(!xiW2, '第2周周四不应有习近平课程');

// Test 3: 习近平课程第10周应该有
const xiW10 = coursesOnWeek(10, 4).find(c => c.id === 'xi-jinping-thought');
console.assert(xiW10, '第10周周四应有习近平课程');

// Test 4: 习近平课程第11周不应该有
const xiW11 = coursesOnWeek(11, 4).find(c => c.id === 'xi-jinping-thought');
console.assert(!xiW11, '第11周周四不应有习近平课程');

// Test 5: 大学计算机基础第4周应该有（周一和周五）
const compW4Mon = coursesOnWeek(4, 1).find(c => c.id === 'computer-basics-mon');
const compW4Fri = coursesOnWeek(4, 5).find(c => c.id === 'computer-basics-fri');
console.assert(compW4Mon, '第4周周一应有大学计算机基础');
console.assert(compW4Fri, '第4周周五应有大学计算机基础');

// Test 6: 大学计算机基础第3周不应该有
const compW3Mon = coursesOnWeek(3, 1).find(c => c.id === 'computer-basics-mon');
console.assert(!compW3Mon, '第3周周一不应有大学计算机基础');

// Test 7: 国家安全第6周应该有
const securityW6 = coursesOnWeek(6, 3).find(c => c.id === 'national-security');
console.assert(securityW6, '第6周周三应有国家安全课程');

// Test 8: 国家安全第5周不应该有
const securityW5 = coursesOnWeek(5, 3).find(c => c.id === 'national-security');
console.assert(!securityW5, '第5周周三不应有国家安全课程');

console.log('课程周次修复测试全部通过！');
