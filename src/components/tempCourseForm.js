import { getTempCourses, deleteTempCourse, clearAllTempCourses } from '../lib/tempCourses.js';

// 显示添加/修改课程表单
export function showTempCourseForm(currentWeek, currentDay, existingCourse = null, onClose = null) {
  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.className = 'temp-course-overlay';
  overlay.innerHTML = `
    <div class="temp-course-form">
      <h3>${existingCourse ? '修改课程' : '添加临时课程'}</h3>
      <form id="temp-course-form">
        <div class="form-group">
          <label>课程名称</label>
          <input type="text" name="name" required value="${existingCourse?.name || ''}" placeholder="例如：临时讲座">
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>星期</label>
            <select name="dayOfWeek" required>
              <option value="1" ${existingCourse?.dayOfWeek === 1 ? 'selected' : ''}>周一</option>
              <option value="2" ${existingCourse?.dayOfWeek === 2 ? 'selected' : ''}>周二</option>
              <option value="3" ${existingCourse?.dayOfWeek === 3 ? 'selected' : ''}>周三</option>
              <option value="4" ${existingCourse?.dayOfWeek === 4 ? 'selected' : ''}>周四</option>
              <option value="5" ${existingCourse?.dayOfWeek === 5 ? 'selected' : ''}>周五</option>
              <option value="6" ${existingCourse?.dayOfWeek === 6 ? 'selected' : ''}>周六</option>
              <option value="7" ${existingCourse?.dayOfWeek === 7 ? 'selected' : ''}>周日</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>教室</label>
            <input type="text" name="classroom" value="${existingCourse?.classroom || ''}" placeholder="例如：教学一号楼101">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>开始节次</label>
            <select name="startPeriod" required>
              ${Array.from({length: 14}, (_, i) => i + 1).map(p => 
                `<option value="${p}" ${existingCourse?.startPeriod === p ? 'selected' : ''}>第${p}节</option>`
              ).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label>结束节次</label>
            <select name="endPeriod" required>
              ${Array.from({length: 14}, (_, i) => i + 1).map(p => 
                `<option value="${p}" ${existingCourse?.endPeriod === p ? 'selected' : ''}>第${p}节</option>`
              ).join('')}
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>开始周</label>
            <input type="number" name="startWeek" min="1" max="19" required value="${existingCourse?.startWeek || currentWeek}">
          </div>
          
          <div class="form-group">
            <label>结束周</label>
            <input type="number" name="endWeek" min="1" max="19" required value="${existingCourse?.endWeek || currentWeek}">
          </div>
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" name="singleWeek" ${!existingCourse && currentWeek ? 'checked' : ''}>
            仅当前周（第${currentWeek}周）
          </label>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-cancel">取消</button>
          <button type="submit" class="btn-submit">${existingCourse ? '保存' : '添加'}</button>
          ${existingCourse ? '<button type="button" class="btn-delete">删除</button>' : ''}
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  // 绑定事件
  const form = overlay.querySelector('#temp-course-form');
  const singleWeekCheckbox = overlay.querySelector('[name="singleWeek"]');
  const startWeekInput = overlay.querySelector('[name="startWeek"]');
  const endWeekInput = overlay.querySelector('[name="endWeek"]');

  // 单选周复选框逻辑
  singleWeekCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      startWeekInput.value = currentWeek;
      endWeekInput.value = currentWeek;
      startWeekInput.disabled = true;
      endWeekInput.disabled = true;
    } else {
      startWeekInput.disabled = false;
      endWeekInput.disabled = false;
    }
  });

  // 初始化单选周状态
  if (singleWeekCheckbox.checked) {
    startWeekInput.disabled = true;
    endWeekInput.disabled = true;
  }

  // 取消按钮
  overlay.querySelector('.btn-cancel').addEventListener('click', () => {
    overlay.remove();
    if (onClose) onClose();
  });

  // 点击遮罩关闭
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      if (onClose) onClose();
    }
  });

  // 删除按钮（仅修改模式）
  if (existingCourse) {
    overlay.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('确定要删除这个临时课程吗？')) {
        deleteTempCourse(existingCourse.id);
        overlay.remove();
        if (onClose) onClose();
      }
    });
  }

  // 提交表单
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    const course = {
      name: formData.get('name'),
      dayOfWeek: parseInt(formData.get('dayOfWeek')),
      startPeriod: parseInt(formData.get('startPeriod')),
      endPeriod: parseInt(formData.get('endPeriod')),
      startWeek: parseInt(formData.get('startWeek')),
      endWeek: parseInt(formData.get('endWeek')),
      classroom: formData.get('classroom'),
      color: 'var(--color-temp-course)',
    };

    // 验证
    if (course.startPeriod > course.endPeriod) {
      alert('开始节次不能大于结束节次');
      return;
    }
    if (course.startWeek > course.endWeek) {
      alert('开始周不能大于结束周');
      return;
    }

    addTempCourse(course);
    overlay.remove();
    if (onClose) onClose();
  });
}

// 显示临时课程列表管理
export function showTempCourseList(onClose = null) {
  const tempCourses = getTempCourses();

  const overlay = document.createElement('div');
  overlay.className = 'temp-course-overlay';
  
  let html = `
    <div class="temp-course-list">
      <h3>临时课程管理</h3>
      ${tempCourses.length === 0 ? '<p class="empty-message">暂无临时课程</p>' : ''}
      <ul class="temp-course-items">
  `;

  tempCourses.forEach(course => {
    html += `
      <li class="temp-course-item" data-id="${course.id}">
        <div class="course-info">
          <div class="course-name">${course.name}</div>
          <div class="course-meta">
            周${course.startWeek}-${course.endWeek} · 
            周${course.dayOfWeek} · 
            第${course.startPeriod}-${course.endPeriod}节
            ${course.classroom ? ' · ' + course.classroom : ''}
          </div>
        </div>
        <button class="btn-delete-small" data-id="${course.id}">删除</button>
      </li>
    `;
  });

  html += `
      </ul>
      <div class="form-actions">
        <button class="btn-clear-all" ${tempCourses.length === 0 ? 'disabled' : ''}>清空全部</button>
        <button class="btn-close">关闭</button>
      </div>
    </div>
  `;

  overlay.innerHTML = html;
  document.body.appendChild(overlay);

  // 绑定删除事件
  overlay.querySelectorAll('.btn-delete-small').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('确定要删除这个临时课程吗？')) {
        deleteTempCourse(id);
        overlay.remove();
        showTempCourseList(onClose); // 重新显示列表
      }
    });
  });

  // 清空全部
  overlay.querySelector('.btn-clear-all').addEventListener('click', () => {
    if (confirm('确定要清空所有临时课程吗？此操作不可恢复。')) {
      clearAllTempCourses();
      overlay.remove();
      if (onClose) onClose();
    }
  });

  // 关闭按钮
  overlay.querySelector('.btn-close').addEventListener('click', () => {
    overlay.remove();
    if (onClose) onClose();
  });

  // 点击遮罩关闭
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      if (onClose) onClose();
    }
  });
}
