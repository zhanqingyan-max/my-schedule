const STORAGE_KEY = 'my-schedule.homeworks.v1';

function loadHomeworks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHomeworks(homeworks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(homeworks));
}

export function addHomework(hw) {
  const homeworks = loadHomeworks();
  const newHw = {
    ...hw,
    id: crypto.randomUUID(),
    done: false,
    createdAt: Date.now(),
  };
  homeworks.push(newHw);
  saveHomeworks(homeworks);
  return newHw;
}

export function updateHomework(id, updates) {
  const homeworks = loadHomeworks();
  const idx = homeworks.findIndex(h => h.id === id);
  if (idx === -1) return null;
  homeworks[idx] = { ...homeworks[idx], ...updates };
  saveHomeworks(homeworks);
  return homeworks[idx];
}

export function removeHomework(id) {
  const homeworks = loadHomeworks();
  const filtered = homeworks.filter(h => h.id !== id);
  if (filtered.length === homeworks.length) return false;
  saveHomeworks(filtered);
  return true;
}

export function toggleHomeworkDone(id) {
  const homeworks = loadHomeworks();
  const hw = homeworks.find(h => h.id === id);
  if (!hw) return null;
  hw.done = !hw.done;
  saveHomeworks(homeworks);
  return hw;
}

export function listHomeworks() {
  return loadHomeworks();
}

export function getPendingHomeworks() {
  return loadHomeworks()
    .filter(h => !h.done)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function getCompletedHomeworks() {
  return loadHomeworks()
    .filter(h => h.done)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
