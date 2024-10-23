export function current_datetime(): Date {
  return new Date(Date.now());
}

export function forward_datetime(second: number): Date {
  return new Date(Date.now() + second * 1000);
}
