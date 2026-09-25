import { coursesOnWeek } from '../src/data/courses.js';

// 占卿妍的课程测试

// Test 1: 化学实验第3周
const chemW3 = coursesOnWeek(3, 2).find(c => c.id === 'chemistry-experiment-w3');
console.assert(chemW3, '第3周周二应有化学实验');
console.assert(chemW3.name.includes('茶叶中微量元素'), '实验名称应包含茶叶中微量元素');
console.assert(chemW3.startPeriod === 11 && chemW3.endPeriod === 14, '应为11-14节');

// Test 2: 化学实验第11周
const chemW11 = coursesOnWeek(11, 2).find(c => c.id === 'chemistry-experiment-w11');
console.assert(chemW11, '第11周周二应有化学实验');
console.assert(chemW11.name.includes('低维纳米'), '实验名称应包含低维纳米');

// Test 3: 工程认识第2周（特种加工）
const engW2 = coursesOnWeek(2, 1).find(c => c.id === 'engineering-recognition-w2');
console.assert(engW2, '第2周周一应有工程认识');
console.assert(engW2.name.includes('特种加工'), '应为特种加工');
console.assert(engW2.classroom.includes('B1036'), '地点应为B1036实验室');

// Test 4: 工程认识第3周（3D技术与机器人）
const engW3 = coursesOnWeek(3, 1).find(c => c.id === 'engineering-recognition-w3');
console.assert(engW3, '第3周周一应有工程认识');
console.assert(engW3.name.includes('3D技术与机器人'), '应为3D技术与机器人');
console.assert(engW3.classroom.includes('B1043'), '地点应为B1043实验室');

// Test 5: 工程认识第4周（虚拟仿真+嵌入式系统）
const engW4Virtual = coursesOnWeek(4, 1).find(c => c.id === 'engineering-recognition-w4-virtual');
const engW4Embedded = coursesOnWeek(4, 1).find(c => c.id === 'engineering-recognition-w4-embedded');
console.assert(engW4Virtual, '第4周周一应有虚拟仿真');
console.assert(engW4Embedded, '第4周周一应有嵌入式系统');
console.assert(engW4Virtual.startPeriod === 2 && engW4Virtual.endPeriod === 3, '虚拟仿真应为2-3节');
console.assert(engW4Embedded.startPeriod === 4 && engW4Embedded.endPeriod === 5, '嵌入式系统应为4-5节');

// Test 6: 工程认识第6周（精密铸造）
const engW6 = coursesOnWeek(6, 1).find(c => c.id === 'engineering-recognition-w6');
console.assert(engW6, '第6周周一应有工程认识');
console.assert(engW6.name.includes('精密铸造'), '应为精密铸造');
console.assert(engW6.classroom.includes('B1044'), '地点应为B1044实验室');

// Test 7: 其他周次不应有工程认识
const engW1 = coursesOnWeek(1, 1).filter(c => c.id.startsWith('engineering-recognition'));
const engW5 = coursesOnWeek(5, 1).filter(c => c.id.startsWith('engineering-recognition'));
console.assert(engW1.length === 0, '第1周不应有工程认识');
console.assert(engW5.length === 0, '第5周（假期）不应有工程认识');

console.log('占卿妍课程测试全部通过！');
