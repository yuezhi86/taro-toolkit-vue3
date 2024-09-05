import { toFixed } from './toFixed';

// 三位分节计数
export function formatNumber(value?: Numberish, n = 2) {
  if (!value && typeof value !== 'number') return toFixed(0, n);

  let number;

  try {
    number = toFixed(Number(value), n).replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      '$1,'
    );
  } catch (e) {
    number = toFixed(value, n);
  }

  return `${number}`;
}
