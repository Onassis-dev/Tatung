import { format, toZonedTime } from 'date-fns-tz';

export function getTijuanaDate() {
  const timeZone = 'America/Tijuana';
  const now = new Date();
  const zonedDate = toZonedTime(now, timeZone);
  return format(zonedDate, 'yyyy-MM-dd');
}
