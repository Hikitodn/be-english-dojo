import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const now = dayjs();

export function current_datetime(): Date {
  return now.toDate();
}

export function forward_current_datetime_by_milisecond(ms: number): Date {
  return now.add(ms, 'ms').toDate();
}

export function format_datetime(date: Date): string {
  return dayjs(date).format('MM/DD/YYYY');
}

export function get_day(date?: Date): number {
  return dayjs(date).day();
}

export function convert_ms_to_sec(ms: number) {
  return Math.floor(ms / 1000);
}

export function format_day_of_week(day: number): string {
  return now.day(day).format('dddd');
}

export function format_month(date: Date) {
  return dayjs(date).format('MM/YYYY');
}

export function format_currency(
  amount: string,
  locale: string,
  currency: string,
) {
  const money = parseFloat(amount.replace(/[^0-9.-]+/g, ''));

  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(money);
}

export function generate_uuid(length?: number) {
  return nanoid(length);
}

export function compare_date(date1: Date, date2: Date) {
  return dayjs(date1).diff(dayjs(date2));
}
