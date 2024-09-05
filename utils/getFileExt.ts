export function getFileExt(name: string) {
  const extRegx = /\S+\.([\da-zA-Z]+)$/;
  const matchRes = name.match(extRegx);
  return (matchRes ? matchRes[1] : '').toLocaleLowerCase();
}
