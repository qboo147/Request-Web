/**
 * Sets an item in localStorage with an expiry time
 * @param {string} key - The key under which to store the item.
 * @param {T} value - The value to be stored. Can be any type but must be serializable.
 * @param {number} ttl - Time to live in milliseconds.
 */
export function setItemWithExpiry<T>(key: string, value: T, ttl: number): void {
  const now = new Date();

  const item = {
    value: JSON.stringify(value), // Serialize value to ensure it can be stored properly
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Retrieves an item from localStorage and checks if it's expired.
 * @param {string} key - The key of the item to retrieve.
 * @return {T | null} - Returns the value or null if the item doesn't exist or is expired.
 */
export function getItemWithExpiry<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return JSON.parse(item.value) as T; // Deserialize value and cast to type T
}
