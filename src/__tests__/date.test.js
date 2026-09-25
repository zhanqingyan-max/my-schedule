import { describe, it, expect } from 'vitest';
import { dateToWeekInfo, weekRange, isHolidayWeek, formatCN, isSameDay } from '../lib/date.js';

describe('dateToWeekInfo', () => {
  it('2026-09-07 应为第 1 周周一', () => {
    const info = dateToWeekInfo('2026-09-07');
    expect(info).toEqual({ week: 1, dayOfWeek: 1, date: expect.any(Date) });
  });

  it('2026-09-25 应为第 3 周周五', () => {
    const info = dateToWeekInfo('2026-09-25');
    expect(info).toEqual({ week: 3, dayOfWeek: 5, date: expect.any(Date) });
  });

  it('2026-10-05 应为第 5 周周一（假期周）', () => {
    const info = dateToWeekInfo('2026-10-05');
    expect(info).toEqual({ week: 5, dayOfWeek: 1, date: expect.any(Date) });
  });

  it('2026-09-06 应返回 null（第 1 周之前）', () => {
    expect(dateToWeekInfo('2026-09-06')).toBeNull();
  });

  it('2027-01-20 应返回 null（超出学期）', () => {
    expect(dateToWeekInfo('2027-01-20')).toBeNull();
  });
});

describe('weekRange', () => {
  it('第 1 周应为 9.7-9.13', () => {
    const { mon, sun } = weekRange(1);
    expect(mon.getDate()).toBe(7);
    expect(sun.getDate()).toBe(13);
  });

  it('第 3 周应为 9.21-9.27', () => {
    const { mon, sun } = weekRange(3);
    expect(mon.getDate()).toBe(21);
    expect(sun.getDate()).toBe(27);
  });
});

describe('isHolidayWeek', () => {
  it('第 5 周应为假期', () => {
    expect(isHolidayWeek(5)).toBe(true);
  });

  it('第 3 周不应为假期', () => {
    expect(isHolidayWeek(3)).toBe(false);
  });
});

describe('formatCN', () => {
  it('2026-09-25 应格式化为 9月25日 周五 · 第3周', () => {
    expect(formatCN('2026-09-25')).toBe('9月25日 周五 · 第3周');
  });
});

describe('isSameDay', () => {
  it('同一天应返回 true', () => {
    expect(isSameDay('2026-09-25', '2026-09-25')).toBe(true);
  });

  it('不同天应返回 false', () => {
    expect(isSameDay('2026-09-25', '2026-09-26')).toBe(false);
  });
});
