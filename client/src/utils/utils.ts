export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null) return false;

  // Exclude 'id' and 'recordedAt' from comparison
  const keysA = Object.keys(a).filter(key => key !== 'id' && key !== 'recordedAt');
  const keysB = Object.keys(b).filter(key => key !== 'id' && key !== 'recordedAt');

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}
