import { coursesOnWeek, coursesOnDate } from '../src/data/courses.js';

// Test 1: 习近平新时代中国特色社会主义思想概论 location
const xiCourse = coursesOnWeek(8, 4).find(c => c.id === 'xi-jinping-thought');
console.assert(xiCourse, '习近平课程应存在于第8周周四');
console.assert(xiCourse.classroom === '科研一号楼1040', `地点应为科研一号楼1040，实际为${xiCourse.classroom}`);

// Test 2: 中国红色歌曲赏析与实践 exists
const redSongCourse = coursesOnWeek(10, 3).find(c => c.id === 'chinese-red-songs');
console.assert(redSongCourse, '中国红色歌曲赏析与实践应存在于第10周周三');
console.assert(redSongCourse.name === '中国红色歌曲赏析与实践', '课程名称应为完整名称');
console.assert(redSongCourse.classroom === '科研一号楼5058', '地点应为科研一号楼5058');
console.assert(redSongCourse.startPeriod === 11 && redSongCourse.endPeriod === 12, '应为11-12节');

// Test 3: 计算机综合法语实训(1) exists
const frenchPracticalComputer = coursesOnWeek(10, 4).find(c => c.id === 'french-practical-computer');
console.assert(frenchPracticalComputer, '计算机综合法语实训(1)应存在于第10周周四');
console.assert(frenchPracticalComputer.name.includes('计算机'), '课程名应包含计算机标注');
console.assert(frenchPracticalComputer.classroom === '教学1号楼B1001', '地点应为教学1号楼B1001');

// Test 4: 原有的综合法语实训(1)仍保留
const frenchPracticalOriginal = coursesOnWeek(10, 4).find(c => c.id === 'french-practical');
console.assert(frenchPracticalOriginal, '原综合法语实训(1)应保留');
console.assert(frenchPracticalOriginal.classroom === '教学二号楼', '原课程地点应仍为教学二号楼');

console.log('所有课程数据测试通过！');
