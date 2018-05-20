import mapValues from "lodash/mapValues";
import mapKeys from "lodash/mapKeys";
import isObject from "lodash/isObject";
import isArray from "lodash/isArray";
import { utils } from "ynab";

export const mapKeysDeep = (obj, cb) => {
  if (isArray(obj)) {
    return obj.map(innerObj => mapKeysDeep(innerObj, cb));
  } else if (isObject(obj)) {
    return mapValues(mapKeys(obj, cb), val => mapKeysDeep(val, cb));
  } else {
    return obj;
  }
};

export const formatCurrency = utils.convertMilliUnitsToCurrencyAmount;

export const getStorage = key => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export const setStorage = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

export const upsertBy = (arr, key, obj) => {
  let exists = false;
  const newArr = arr.map(i => {
    if (i[key] === obj[key]) {
      exists = true;
      return obj;
    }
    return i;
  });
  return exists ? newArr : newArr.concat(obj);
};
