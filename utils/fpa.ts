export const add = function (a: Numberish, b: Numberish) {
  const c = _floatLength(a);
  const d = _floatLength(b);
  const e = Math.pow(10, Math.max(c, d));

  return (multiply(a, e) + multiply(b, e)) / e;
};

export const subtract = function (a: Numberish, b: Numberish) {
  const c = _floatLength(a);
  const d = _floatLength(b);
  const e = Math.pow(10, Math.max(c, d));

  return (multiply(a, e) - multiply(b, e)) / e;
};

export const multiply = function (a: Numberish, b: Numberish) {
  const c = Number(a.toString().replace('.', ''));
  const d = Number(b.toString().replace('.', ''));
  const e = _floatLength(a) + _floatLength(b);

  return (c * d) / Math.pow(10, e);
};

export const divide = function (a: Numberish, b: Numberish) {
  const c = Number(a.toString().replace('.', ''));
  const d = Number(b.toString().replace('.', ''));
  const e = _floatLength(a);
  const f = _floatLength(b);

  return multiply(c / d, Math.pow(10, f - e));
};

function _floatLength(float: Numberish) {
  try {
    return float.toString().split('.')[1].length;
  } catch (e) {
    return 0;
  }
}
