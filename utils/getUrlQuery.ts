export function getUrlQuery(query: AnyObject = {}) {
  let string = '';
  const keys = Object.keys(query);
  keys.forEach((key) => {
    string += `&${key}=${query[key]}`;
  });

  return string.substring(1);
}
