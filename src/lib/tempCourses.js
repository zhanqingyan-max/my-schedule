// 临时课程管理 - 存储在 localStorage

const STORAGE_KEY = 'my-schedule.temp-courses.v1';

// 生成唯一ID
function generateId() {
  return 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// 获取所有临时课程
export function getTempCourses() {
  try {
    if (typeof localStorage === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('读取临时课程失败:', e);
    return [];
  }
}

// 保存临时课程列表
function saveTempCourses(courses) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('保存临时课程失败:', e);
  }
}

// 添加临时课程
export function addTempCourse(course) {
  const courses = getTempCourses();
  const newCourse = {
    ...course,
    id: generateId(),
    isTemp: true,
    createdAt: new Date().toISOString(),
  };
  courses.push(newCourse);
  saveTempCourses(courses);
  return newCourse;
}

// 删除临时课程
export function deleteTempCourse(id) {
  const courses = getTempCourses().filter(c => c.id !== id);
  saveTempCourses(courses);
}

// 清空所有临时课程
export function clearAllTempCourses() {
  saveTempCourses([]);
}

// 获取指定周次和星期的所有课程（包括临时课程）
export function getAllCoursesOnWeek(week, dayOfWeek, baseCourses) {
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
