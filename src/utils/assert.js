export function assert(condition, errorMsg) {
  if (!condition) throw new Error(errorMsg || "assertion error");
}
