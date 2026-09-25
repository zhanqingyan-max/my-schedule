// 北航 2026-2027 学年校历常量

// 第 1 周周一（本地时间午夜）
export const SEMESTER1_WEEK1_MONDAY = new Date(2026, 8, 7); // 2026-09-07
export const SEMESTER1_TOTAL_WEEKS = 19;

// 假期周（第 5 周国庆中秋，10.5-10.7 无课）
export const HOLIDAY_WEEKS = new Set([5]);

// 学期边界（第 1 周周一 到 第 19 周周日）
export function getSemester1Range() {
  const start = new Date(SEMESTER1_WEEK1_MONDAY);
  const end = new Date(start);
  end.setDate(end.getDate() + SEMESTER1_TOTAL_WEEKS * 7 - 1);
  return { start, end };
}