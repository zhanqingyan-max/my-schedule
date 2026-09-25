// 1-14 节课时间表

export const PERIOD_TIMES = {
  1: { start: '08:00', end: '08:45' },
  2: { start: '08:50', end: '09:35' },
  3: { start: '09:50', end: '10:35' },
  4: { start: '10:40', end: '11:25' },
  5: { start: '11:30', end: '12:15' },
  6: { start: '14:00', end: '14:45' },
  7: { start: '14:50', end: '15:35' },
  8: { start: '15:50', end: '16:35' },
  9: { start: '16:40', end: '17:25' },
  10: { start: '17:30', end: '18:15' },
  11: { start: '19:00', end: '19:45' },
  12: { start: '19:50', end: '20:35' },
  13: { start: '20:40', end: '21:25' },
  14: { start: '21:30', end: '22:15' },
};

export function periodsToRange(startPeriod, endPeriod) {
  const start = PERIOD_TIMES[startPeriod]?.start;
  const end = PERIOD_TIMES[endPeriod]?.end;
  return { start, end };
}

export function periodToMinutes(period) {
  const time = PERIOD_TIMES[period];
  if (!time) return null;
  const [h, m] = time.start.split(':').map(Number);
  return h * 60 + m;
}
