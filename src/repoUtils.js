import get from "lodash/get";
import { mapKeysDeep, getStorage, setStorage } from "./utils";
import camelCase from "lodash/camelCase";

const camelCaseKeys = obj => mapKeysDeep(obj, (val, key) => camelCase(key));

export const makeCachedCall = ({
  apiCall,
  storageKey,
  onFailure,
  formatter = a => a
}) => param => {
  const cachedAll = getStorage(storageKey);
  const cached = param ? get(cachedAll, param) : cachedAll;

  if (cached) {
    return Promise.resolve(formatter(camelCaseKeys(cached)));
  } else {
    return apiCall(param)
      .then(({ data }) => {
        setStorage(storageKey, param ? { ...cachedAll, [param]: data } : data);
        return formatter(camelCaseKeys(data));
      })
      .catch(onFailure);
  }
};
