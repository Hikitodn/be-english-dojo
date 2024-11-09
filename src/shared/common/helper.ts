export function current_datetime(): Date {
  return new Date(Date.now());
}

export function forward_current_datetime(millisecond: number): Date {
  return new Date(Date.now() + millisecond);
}
