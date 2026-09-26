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

// 法定节假日（日期范围）
export const LEGAL_HOLIDAYS = [
  { name: '中秋节', start: '2026-09-25', end: '2026-09-27' },
  { name: '国庆节', start: '2026-10-01', end: '2026-10-07' },
  { name: '元旦', start: '2027-01-01', end: '2027-01-03' },
  { name: '春节', start: '2027-02-06', end: '2027-02-12' },
  { name: '清明节', start: '2027-04-04', end: '2027-04-06' },
  { name: '劳动节', start: '2027-05-01', end: '2027-05-05' },
  { name: '端午节', start: '2027-05-30', end: '2027-06-01' },
];

// 农历重要日期（初一、十五及传统节日）
export const LUNAR_DATES = {
  '2026-09-11': { lunarMonth: 8, lunarDay: 1, label: '八月初一' },
  '2026-09-25': { lunarMonth: 8, lunarDay: 15, label: '中秋节' },
  '2026-10-10': { lunarMonth: 9, lunarDay: 1, label: '九月初一' },
  '2026-10-24': { lunarMonth: 9, lunarDay: 15, label: '九月十五' },
  '2026-11-08': { lunarMonth: 10, lunarDay: 1, label: '十月初一' },
  '2026-11-22': { lunarMonth: 10, lunarDay: 15, label: '十月十五' },
  '2026-12-08': { lunarMonth: 11, lunarDay: 1, label: '十一月初一' },
  '2026-12-22': { lunarMonth: 11, lunarDay: 15, label: '十一月十五' },
  '2027-01-07': { lunarMonth: 12, lunarDay: 1, label: '十二月初一' },
  '2027-01-21': { lunarMonth: 12, lunarDay: 15, label: '十二月十五' },
  '2027-02-06': { lunarMonth: 1, lunarDay: 1, label: '春节' },
  '2027-02-20': { lunarMonth: 1, lunarDay: 15, label: '元宵节' },
};

export function getHolidayOnDate(dateStr) {
  for (const holiday of LEGAL_HOLIDAYS) {
    if (dateStr >= holiday.start && dateStr <= holiday.end) {
      return holiday.name;
    }
  }
  return null;
}

export function getLunarDate(dateStr) {
  return LUNAR_DATES[dateStr] || null;
}

export function getHolidayDecorationSVG(dateStr) {
  const holiday = getHolidayOnDate(dateStr);
  const lunar = getLunarDate(dateStr);
  const name = holiday || lunar?.label;

  switch (name) {
    case '中秋节': return `
      <svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="24" r="20" fill="#F5D76E" opacity="0.15"/>
        <circle cx="40" cy="24" r="15" fill="#F5D76E" opacity="0.6"/>
        <circle cx="35" cy="20" r="3" fill="#D4AC51" opacity="0.25"/>
        <circle cx="44" cy="27" r="2.5" fill="#D4AC51" opacity="0.2"/>
        <circle cx="38" cy="29" r="2" fill="#D4AC51" opacity="0.15"/>
        <ellipse cx="20" cy="38" rx="12" ry="4" fill="#8B8B8B" opacity="0.12"/>
        <ellipse cx="58" cy="34" rx="10" ry="3.5" fill="#8B8B8B" opacity="0.1"/>
        <circle cx="12" cy="10" r="1" fill="#F5D76E" opacity="0.4"/>
        <circle cx="68" cy="8" r="0.8" fill="#F5D76E" opacity="0.3"/>
        <circle cx="72" cy="18" r="1.2" fill="#F5D76E" opacity="0.35"/>
        <circle cx="6" cy="22" r="0.7" fill="#F5D76E" opacity="0.25"/>
      </svg>`;

    case '国庆节': return `
      <svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg">
        <line x1="18" y1="6" x2="18" y2="58" stroke="#8B7355" stroke-width="2" opacity="0.6"/>
        <rect x="20" y="8" width="30" height="20" rx="1" fill="#C45C4E" opacity="0.65"/>
        <circle cx="28" cy="15" r="2" fill="#F5D76E" opacity="0.8"/>
        <circle cx="33" cy="11" r="1" fill="#F5D76E" opacity="0.6"/>
        <circle cx="36" cy="14" r="1" fill="#F5D76E" opacity="0.6"/>
        <circle cx="35" cy="19" r="1" fill="#F5D76E" opacity="0.6"/>
        <circle cx="31" cy="22" r="1" fill="#F5D76E" opacity="0.6"/>
        <circle cx="62" cy="14" r="3.5" fill="#C45C4E" opacity="0.35"/>
        <line x1="62" y1="17.5" x2="62" y2="26" stroke="#C45C4E" stroke-width="0.8" opacity="0.25"/>
        <rect x="60" y="12" width="4" height="1.5" rx="0.5" fill="#F5D76E" opacity="0.35"/>
        <circle cx="56" cy="36" r="2.5" fill="#C45C4E" opacity="0.25"/>
        <line x1="56" y1="38.5" x2="56" y2="44" stroke="#C45C4E" stroke-width="0.6" opacity="0.18"/>
        <rect x="54.5" y="34.5" width="3" height="1.2" rx="0.5" fill="#F5D76E" opacity="0.25"/>
      </svg>`;

    case '元旦': return `
      <svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg">
        <line x1="22" y1="18" x2="12" y2="6" stroke="#C45C4E" stroke-width="1.2" opacity="0.45" stroke-linecap="round"/>
        <line x1="22" y1="18" x2="28" y2="4" stroke="#F5D76E" stroke-width="1" opacity="0.4" stroke-linecap="round"/>
        <line x1="22" y1="18" x2="8" y2="16" stroke="#C45C4E" stroke-width="0.8" opacity="0.3" stroke-linecap="round"/>
        <line x1="22" y1="18" x2="34" y2="10" stroke="#F5D76E" stroke-width="0.8" opacity="0.35" stroke-linecap="round"/>
        <circle cx="12" cy="6" r="1.5" fill="#C45C4E" opacity="0.5"/>
        <circle cx="28" cy="4" r="1.2" fill="#F5D76E" opacity="0.5"/>
        <line x1="58" y1="22" x2="50" y2="10" stroke="#C45C4E" stroke-width="1" opacity="0.35" stroke-linecap="round"/>
        <line x1="58" y1="22" x2="66" y2="8" stroke="#F5D76E" stroke-width="0.8" opacity="0.3" stroke-linecap="round"/>
        <line x1="58" y1="22" x2="70" y2="18" stroke="#C45C4E" stroke-width="0.8" opacity="0.25" stroke-linecap="round"/>
        <circle cx="50" cy="10" r="1.2" fill="#C45C4E" opacity="0.4"/>
        <circle cx="66" cy="8" r="1" fill="#F5D76E" opacity="0.4"/>
        <text x="30" y="48" font-size="14" fill="#C45C4E" opacity="0.35" font-family="serif">2027</text>
      </svg>`;

    case '春节': return `
      <svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg">
        <line x1="24" y1="0" x2="24" y2="8" stroke="#C45C4E" stroke-width="0.8" opacity="0.35"/>
        <ellipse cx="24" cy="20" rx="8" ry="12" fill="#C45C4E" opacity="0.55"/>
        <rect x="19" y="7" width="10" height="3.5" rx="1" fill="#F5D76E" opacity="0.55"/>
        <rect x="19" y="29" width="10" height="3" rx="1" fill="#F5D76E" opacity="0.45"/>
        <line x1="24" y1="32" x2="24" y2="38" stroke="#C45C4E" stroke-width="0.8" opacity="0.35"/>
        <line x1="22" y1="38" x2="26" y2="38" stroke="#C45C4E" stroke-width="0.8" opacity="0.25"/>
        <rect x="21" y="17" width="6" height="6" rx="0.5" fill="#F5D76E" opacity="0.25"/>
        <line x1="56" y1="0" x2="56" y2="6" stroke="#C45C4E" stroke-width="0.8" opacity="0.35"/>
        <ellipse cx="56" cy="17" rx="6.5" ry="10" fill="#C45C4E" opacity="0.45"/>
        <rect x="51.5" y="5.5" width="9" height="3" rx="1" fill="#F5D76E" opacity="0.45"/>
        <rect x="51.5" y="24" width="9" height="2.5" rx="1" fill="#F5D76E" opacity="0.35"/>
        <line x1="56" y1="26.5" x2="56" y2="31" stroke="#C45C4E" stroke-width="0.6" opacity="0.25"/>
        <rect x="36" y="42" width="10" height="14" rx="1" fill="#C45C4E" opacity="0.35"/>
        <rect x="38" y="44" width="6" height="10" rx="0.5" fill="#F5D76E" opacity="0.2"/>
      </svg>`;

    case '元宵节': return `
      <svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="0" x2="20" y2="10" stroke="#C45C4E" stroke-width="0.8" opacity="0.3"/>
        <circle cx="20" cy="24" r="12" fill="#C45C4E" opacity="0.35"/>
        <circle cx="20" cy="24" r="8" fill="#F5D76E" opacity="0.25"/>
        <line x1="20" y1="36" x2="20" y2="42" stroke="#F5D76E" stroke-width="0.6" opacity="0.25"/>
        <line x1="48" y1="0" x2="48" y2="6" stroke="#C45C4E" stroke-width="0.8" opacity="0.3"/>
        <circle cx="48" cy="18" r="10" fill="#C45C4E" opacity="0.3"/>
        <circle cx="48" cy="18" r="6.5" fill="#F5D76E" opacity="0.2"/>
        <line x1="48" y1="28" x2="48" y2="33" stroke="#F5D76E" stroke-width="0.6" opacity="0.2"/>
        <circle cx="68" cy="12" r="6" fill="#C45C4E" opacity="0.2"/>
        <circle cx="68" cy="12" r="4" fill="#F5D76E" opacity="0.15"/>
        <line x1="68" y1="18" x2="68" y2="22" stroke="#F5D76E" stroke-width="0.5" opacity="0.15"/>
      </svg>`;

    case '清明节': return `
      <svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0 Q22 18 14 40" stroke="#6B8E6B" stroke-width="1.2" fill="none" opacity="0.3"/>
        <ellipse cx="14" cy="12" rx="4" ry="1.5" fill="#6B8E6B" opacity="0.25" transform="rotate(-25 14 12)"/>
        <ellipse cx="18" cy="20" rx="3.5" ry="1.3" fill="#6B8E6B" opacity="0.22" transform="rotate(-15 18 20)"/>
        <ellipse cx="15" cy="28" rx="3.5" ry="1.3" fill="#6B8E6B" opacity="0.2" transform="rotate(-30 15 28)"/>
        <ellipse cx="13" cy="36" rx="3" ry="1.2" fill="#6B8E6B" opacity="0.18" transform="rotate(-20 13 36)"/>
        <path d="M60 0 Q52 14 56 30" stroke="#6B8E6B" stroke-width="1" fill="none" opacity="0.25"/>
        <ellipse cx="55" cy="10" rx="3.5" ry="1.3" fill="#6B8E6B" opacity="0.2" transform="rotate(20 55 10)"/>
        <ellipse cx="54" cy="20" rx="3" ry="1.2" fill="#6B8E6B" opacity="0.18" transform="rotate(15 54 20)"/>
        <line x1="28" y1="4" x2="26" y2="14" stroke="#8BA5B5" stroke-width="0.6" opacity="0.2"/>
        <line x1="42" y1="2" x2="40" y2="12" stroke="#8BA5B5" stroke-width="0.6" opacity="0.18"/>
        <line x1="68" y1="6" x2="66" y2="16" stroke="#8BA5B5" stroke-width="0.6" opacity="0.15"/>
        <line x1="34" y1="14" x2="32" y2="24" stroke="#8BA5B5" stroke-width="0.5" opacity="0.15"/>
      </svg>`;

    case '劳动节': return `
      <svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="16" r="5" fill="#F5A0B0" opacity="0.35"/>
        <circle cx="16" cy="13" r="3.5" fill="#F5A0B0" opacity="0.28"/>
        <circle cx="24" cy="13" r="3.5" fill="#F5A0B0" opacity="0.28"/>
        <circle cx="20" cy="16" r="2" fill="#F5D76E" opacity="0.35"/>
        <line x1="20" y1="21" x2="20" y2="40" stroke="#6B8E6B" stroke-width="1.2" opacity="0.3"/>
        <ellipse cx="15" cy="30" rx="4" ry="1.5" fill="#6B8E6B" opacity="0.25" transform="rotate(-20 15 30)"/>
        <circle cx="52" cy="14" r="4.5" fill="#C45C4E" opacity="0.28"/>
        <circle cx="48" cy="11" r="3" fill="#C45C4E" opacity="0.22"/>
        <circle cx="56" cy="11" r="3" fill="#C45C4E" opacity="0.22"/>
        <circle cx="52" cy="14" r="1.8" fill="#F5D76E" opacity="0.28"/>
        <line x1="52" y1="18.5" x2="52" y2="36" stroke="#6B8E6B" stroke-width="1" opacity="0.25"/>
        <circle cx="36" cy="26" r="3.5" fill="#F5A0B0" opacity="0.22"/>
        <circle cx="36" cy="26" r="1.5" fill="#F5D76E" opacity="0.22"/>
        <line x1="36" y1="29.5" x2="36" y2="42" stroke="#6B8E6B" stroke-width="0.8" opacity="0.2"/>
      </svg>`;

    case '端午节': return `
      <svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 46 Q20 40 40 44 Q60 40 76 46" stroke="#8BA5B5" stroke-width="1" fill="none" opacity="0.2"/>
        <path d="M0 50 Q20 44 40 48 Q60 44 80 50" stroke="#8BA5B5" stroke-width="0.8" fill="none" opacity="0.15"/>
        <path d="M22 38 L32 26 L42 38 Z" fill="#6B8E6B" opacity="0.35"/>
        <rect x="29" y="23" width="6" height="3" rx="0.5" fill="#6B8E6B" opacity="0.28"/>
        <line x1="32" y1="20" x2="32" y2="14" stroke="#6B8E6B" stroke-width="0.8" opacity="0.25"/>
        <path d="M29 14 Q32 10 35 14" stroke="#6B8E6B" stroke-width="0.6" fill="none" opacity="0.2"/>
        <path d="M50 40 L56 32 L62 40 Z" fill="#6B8E6B" opacity="0.25"/>
        <line x1="56" y1="29" x2="56" y2="24" stroke="#6B8E6B" stroke-width="0.6" opacity="0.18"/>
        <path d="M12 48 Q16 44 20 48 Q16 52 12 48" fill="#8B7355" opacity="0.25"/>
        <line x1="10" y1="48" x2="8" y2="45" stroke="#8B7355" stroke-width="0.8" opacity="0.18"/>
        <line x1="22" y1="48" x2="24" y2="45" stroke="#8B7355" stroke-width="0.8" opacity="0.18"/>
      </svg>`;

    default: return '';
  }
}