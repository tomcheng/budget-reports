const cache = {};

export const getStorage = key => {
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
  } catch {
    // Most likely exceeds storage quota
  }
};
