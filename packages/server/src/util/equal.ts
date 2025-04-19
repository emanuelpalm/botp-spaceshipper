export function equal(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  if (typeof a === "object" && typeof b === "object") {
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);

    if (aIsArray && bIsArray) {
      return a.length === b.length && a.every((value, index) => equal(value, b[index]));
    } else if (aIsArray || bIsArray) {
      return false;
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    return aKeys.length === bKeys.length && aKeys.every(key => equal(a[key as keyof typeof a], b[key as keyof typeof b]));
  }

  return false;
}