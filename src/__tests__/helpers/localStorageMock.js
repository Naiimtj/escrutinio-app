import { vi } from 'vitest';

export const createLocalStorageMock = () => {
  let store = {};
  const mock = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
  return mock;
};

export const setupLocalStorageMock = () => {
  const mock = createLocalStorageMock();
  vi.stubGlobal('localStorage', mock);
  return mock;
};
