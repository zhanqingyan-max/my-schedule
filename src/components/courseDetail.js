import { openModal } from './modal.js';
import { periodsToRange } from '../data/periods.js';

export function showCourseDetail(course) {
  const { start, end } = periodsToRange(course.startPeriod, course.endPeriod);
  const periodLabel = course.startPeriod === course.endPeriod
    ? `第${course.startPeriod}节`
    : `第${course.startPeriod}-${course.endPeriod}节`;

  const content = document.createElement('div');
  content.className = 'course-detail';
  content.innerHTML = `
    <div class="course-detail-header" style="background:${course.color};color:white;padding:16px;border-radius:8px;margin-bottom:16px;">
      <h3 style="margin:0;font-size:18px;">${course.name}</h3>
    </div>
    <div class="course-detail-info">
      <div class="info-row">
        <span class="info-label">时间</span>
        <span class="info-value">${periodLabel} ${start}-${end}</span>
      </div>
      <div class="info-row">
        <span class="info-label">教室</span>
        <span class="info-value">${course.classroom || '未指定'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">周次</span>
        <span class="info-value">第${course.startWeek}-${course.endWeek}周</span>
      </div>
      ${course.note ? `
      <div class="info-row">
        <span class="info-label">备注</span>
        <span class="info-value" style="color:var(--color-text-secondary);">${course.note}</span>
      </div>
      ` : ''}
    </div>
  `;

  openModal({ title: '课程详情', content, mode: 'sheet' });
}
