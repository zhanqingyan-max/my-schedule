const STORAGE_KEY = 'my-schedule.birthdays.v1';

function loadBirthdays() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBirthdays(birthdays) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
}

export function addBirthday(birthday) {
  const birthdays = loadBirthdays();
  const newBirthday = {
    ...birthday,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  birthdays.push(newBirthday);
  saveBirthdays(birthdays);
  return newBirthday;
}

export function updateBirthday(id, updates) {
  const birthdays = loadBirthdays();
  const idx = birthdays.findIndex(b => b.id === id);
  if (idx === -1) return null;
  birthdays[idx] = { ...birthdays[idx], ...updates };
  saveBirthdays(birthdays);
  return birthdays[idx];
}

export function removeBirthday(id) {
  const birthdays = loadBirthdays();
  const filtered = birthdays.filter(b => b.id !== id);
  if (filtered.length === birthdays.length) return false;
  saveBirthdays(filtered);
  return true;
}

export function listBirthdays() {
  return loadBirthdays();
}

export function getBirthdaysOnDate(month, day) {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  const key = `${m}-${d}`;
  const today = new Date();
  return loadBirthdays().filter(b => {
    const parts = b.date.split('-');
    return `${parts[1]}-${parts[2]}` === key;
  }).map(b => {
    const parts = b.date.split('-').map(Number);
    const age = today.getFullYear() - parts[0];
    return { ...b, age, diffDays: 0 };
  });
}

export function getNextBirthday(birthday, fromDate) {
  const from = new Date(fromDate);
  const parts = birthday.date.split('-').map(Number);
  const year = from.getFullYear();
  let next = new Date(year, parts[1] - 1, parts[2]);
  if (next < from) {
    next = new Date(year + 1, parts[1] - 1, parts[2]);
  }
  const diffDays = Math.ceil((next - from) / (1000 * 60 * 60 * 24));
  const age = next.getFullYear() - parts[0];
  return { nextDate: next, diffDays, age };
}
