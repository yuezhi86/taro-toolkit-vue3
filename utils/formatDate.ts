import dayjs from 'dayjs';

export function formatDate(
  timestamp: number | string,
  pattern = 'YYYY-MM-DD'
): string {
  if (!timestamp) return '';
  return dayjs(timestamp).format(pattern);
}

export function formatDateTime(
  timestamp: number | string,
  pattern = 'YYYY-MM-DD HH:mm'
): string {
  return formatDate(timestamp, pattern);
}

export function formatDateTimeFull(
  timestamp: number | string,
  pattern = 'YYYY-MM-DD HH:mm:ss'
): string {
  return formatDate(timestamp, pattern);
}

export function formatTime(
  timestamp: number | string,
  pattern = 'HH:mm'
): string {
  return formatDate(timestamp, pattern);
}

const weeks = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
];

export function formatWeek(date: Date) {
  return weeks[date.getDay()];
}
