function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves a UUID from localStorage or generates a new one if not present.
 *
 * @description This function checks if a UUID is stored in the browser's localStorage under the key 'uuid'. 
 * If a UUID is found, it returns the stored UUID. If no UUID is found, it generates a new UUID using the `generateUUID` 
 * function, stores it in localStorage, and then returns it. This ensures that a unique identifier is consistently used 
 * across different sessions for the same user.
 *
 * @returns {string} The UUID retrieved from localStorage or a newly generated UUID.
 *
 * @example
 * // Example usage of getUUID
 * const uuid = getUUID();
 * console.log(uuid); // Outputs the UUID from localStorage or a newly generated one
 */
export function getUUID() {
  // Check if UUID is already in localStorage
  let uuid = localStorage.getItem('uuid');

  if (!uuid) {
    // If not present, generate a new UUID
    uuid = generateUUID();
    localStorage.setItem('uuid', uuid);
  }

  return uuid;
}

/**
 * Retrieves the session ID (SID) from session storage.
 *
 * @description This function fetches the 'sid' (session ID) from the browser's `sessionStorage`. If the 'sid' is not found,
 * it returns an empty string. The SID is typically used for maintaining session state in web applications.
 *
 * @returns {string} The session ID retrieved from `sessionStorage`, or an empty string if not found.
 */
export function getSID() {
  return sessionStorage.getItem('sid') || '';
}