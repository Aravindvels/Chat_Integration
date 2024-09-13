export const getLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const setLocalStorage = (key, payload) => {
  localStorage.setItem(
    key,
    typeof payload === "object" ? JSON.stringify(payload) : payload
  );
};
export const setLocalStorageObject = (obj) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const payload = obj[key];
      localStorage.setItem(
        key,
        typeof payload === "object" ? JSON.stringify(payload) : payload
      );
    }
  }
};
