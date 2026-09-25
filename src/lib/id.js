export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}
