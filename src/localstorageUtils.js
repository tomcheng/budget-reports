import localforage from "localforage";

const cache = {};

export const getStorage = (key) => {
  if (cache[key]) {
    return cache[key];
  }
  const raw = localStorage.getItem(key);
  if (raw) {
    const parsed = JSON.parse(raw);
    cache[key] = parsed;
    return parsed;
  }
  return null;
};

export const setStorage = (key, obj) => {
  delete cache[key];

  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (e) {
    // Most likely exceeds storage quota
  }
};

export const getBigStorage = async (key) => {
  return await localforage.getItem(key);
};

export const setBigStorage = (key, obj) => {
  localforage.setItem(key, obj);
};
