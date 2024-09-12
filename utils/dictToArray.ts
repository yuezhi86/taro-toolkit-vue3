import { zipObject } from 'lodash-es';

type NumberishArray = Array<Numberish>;
type DictObject = { [p: string]: Numberish };
export type DictGeneratorData = DictObject | NumberishArray;
export type DictGeneratorOptions = {
  labelKey?: string;
  valueKey?: string;
  valueType?: 'string' | 'number';
  includes?: NumberishArray;
  excludes?: NumberishArray;
  sort?: NumberishArray;
};
export function dictToArray(
  dict: DictGeneratorData,
  options: DictGeneratorOptions = {}
) {
  const labelKey = options.labelKey ?? 'label';
  const valueKey = options.valueKey ?? 'value';
  const valueType = options.valueType ?? 'string';
  const excludes = (options.excludes ?? []).map((item) => String(item));
  const includes = (options.includes ?? []).map((item) => String(item));
  const sort = (options.sort ?? []).map((item) => String(item));
  let keys: Array<string>;

  if (Array.isArray(dict)) {
    keys = dict.map((item) => String(item));
    dict = zipObject(keys, dict);
  } else {
    keys = Object.keys(dict);
  }

  keys = keys
    .filter((item) => (excludes.length ? !excludes.includes(item) : true))
    .filter((item) => (includes.length ? includes.includes(item) : true));

  const ret: Array<{ [p: string]: Numberish }> = new Array(sort.length).fill(
    undefined
  );

  keys.forEach((item) => {
    const index = sort.indexOf(item);

    if (index > -1) {
      ret[index] = {
        [labelKey]: (dict as DictObject)[item],
        [valueKey]: valueType === 'number' ? parseInt(item) : `${item}`
      };
    } else {
      ret.push({
        [labelKey]: (dict as DictObject)[item],
        [valueKey]: valueType === 'number' ? parseInt(item) : `${item}`
      });
    }
  });

  return ret.filter((item) => item !== undefined);
}

export type ArrayToDictOptions = {
  labelKey?: string;
  valueKey?: string;
  includes?: NumberishArray;
  excludes?: NumberishArray;
};
export function arrayToDict(
  array: AnyObject[] = [],
  options: ArrayToDictOptions = {}
) {
  const labelKey = options.labelKey ?? 'value';
  const valueKey = options.valueKey ?? 'label';
  const excludes = (options.excludes ?? []).map((item) => String(item));
  const includes = (options.includes ?? []).map((item) => String(item));
  const ret = {};
  array.forEach((item) => {
    ret[item[labelKey]] = item[valueKey];
  });

  const keys = Object.keys(ret)
    .filter((item) => (excludes.length ? !excludes.includes(item) : true))
    .filter((item) => (includes.length ? includes.includes(item) : true));

  Object.keys(ret).forEach((item) => {
    if (!keys.includes(item[labelKey])) {
      delete ret[labelKey];
    }
  });

  return ret;
}

export function arrayToEnum(
  array: AnyObject[] = [],
  options: ArrayToDictOptions = {
    labelKey: 'label',
    valueKey: 'value'
  }
) {
  return arrayToDict(array, options);
}
