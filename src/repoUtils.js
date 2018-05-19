import get from "lodash/get";

const getStorage = key => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

const setStorage = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

export const makeCachedCall = ({ apiCall, storageKey, onFailure }) => param => {
  const cachedAll = getStorage(storageKey);
  const cached = param ? get(cachedAll, param) : cachedAll;

  if (cached) {
    return Promise.resolve(cached);
  } else {
    return apiCall(param)
      .then(({ data }) => {
        setStorage(storageKey, param ? { ...cachedAll, [param]: data } : data);
        return data;
      })
      .catch(onFailure);
  }
};
