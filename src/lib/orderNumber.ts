export function makeOrderNumber(seq: number): string {
  const year = new Date().getFullYear();
  return `SDZ-${year}-${seq.toString().padStart(6, "0")}`;
}
