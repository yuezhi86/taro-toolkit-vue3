// 开放规则
export const toOpenRule = (value?: Numberish) => {
  if (!value) return '';

  value = value ?? '';

  const week = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日'
  };
  const stringArray = value
    .split(',')
    .map((item) => week[item])
    .filter((item) => !!item);

  if (stringArray.length === 7) return '每天';

  return '每周' + stringArray.join('、');
};

// 将 0-48 转换成时间格式
export const toTime = (value) => {
  const h = Math.floor(value / 2);
  const m = (value % 2) * 30;

  return `${h}`.padStart(2, '0') + ':' + `${m}`.padStart(2, '0');
};

export const toHours = (value) => {
  return `${value / 2}小时`;
};
