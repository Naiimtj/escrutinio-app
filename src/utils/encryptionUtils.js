// XOR stream cipher for localStorage personal data.
// Key: 32 random bytes, persisted under '_ek'. NOT a server-side security replacement.
// Encrypted strings are prefixed with '_enc:' for backward compatibility.

const ENC_KEY_STORAGE = '_ek';
const KEY_LENGTH = 32;
const ENC_PREFIX = '_enc:';

const getOrCreateKey = () => {
  let keyB64 = localStorage.getItem(ENC_KEY_STORAGE);
  if (!keyB64) {
    const bytes = new Uint8Array(KEY_LENGTH);
    crypto.getRandomValues(bytes);
    keyB64 = btoa(String.fromCharCode(...bytes));
    localStorage.setItem(ENC_KEY_STORAGE, keyB64);
  }
  return keyB64;
};

const getKeyBytes = () =>
  Uint8Array.from(atob(getOrCreateKey()), (c) => c.charCodeAt(0));

export const encryptString = (str) => {
  if (str == null) return str;
  const key = getKeyBytes();
  const bytes = new TextEncoder().encode(String(str));
  const xored = bytes.map((b, i) => b ^ key[i % key.length]);
  return ENC_PREFIX + btoa(String.fromCharCode(...xored));
};

export const decryptString = (cipher) => {
  if (cipher == null) return cipher;
  if (!String(cipher).startsWith(ENC_PREFIX)) return cipher; // legacy plaintext
  try {
    const key = getKeyBytes();
    const bytes = Uint8Array.from(atob(cipher.slice(ENC_PREFIX.length)), (c) =>
      c.charCodeAt(0),
    );
    const xored = bytes.map((b, i) => b ^ key[i % key.length]);
    return new TextDecoder().decode(xored);
  } catch {
    return cipher; // Safety fallback
  }
};

const SENSITIVE_FIELDS = ['name', 'lastName1', 'lastName2', 'location'];

export const encryptPerson = (person) => {
  if (!person) return person;
  const result = { ...person };
  SENSITIVE_FIELDS.forEach((field) => {
    if (result[field] != null) result[field] = encryptString(result[field]);
  });
  return result;
};

export const decryptPerson = (person) => {
  if (!person) return person;
  const result = { ...person };
  SENSITIVE_FIELDS.forEach((field) => {
    if (result[field] != null) result[field] = decryptString(result[field]);
  });
  return result;
};
