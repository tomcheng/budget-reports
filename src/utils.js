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