export function toFixed(value: Numberish | null | undefined, n = 0): string {
  if (value === undefined || value === null) return '';
  // 不是数字，则直接返回 value
  if (typeof value === 'string' && !/^\d+(\.\d+)?$/.test(value)) return value;
  if (value === -Infinity || value === Infinity || Number.isNaN(value))
    return String(value);

  const [integer, decimal] = String(value).split('.');

  // 如果 n 是 0 则直接返回整数部分
  if (!n) return integer;

  // value 是整数
  if (integer && !decimal) {
    return `${integer}.${''.padEnd(n, '0')}`;
  }

  if (decimal.length < n) {
    return `${integer}.${decimal}${''.padEnd(n - decimal.length, '0')}`;
  }

  return `${integer}.${decimal.substring(0, n)}`;
}
