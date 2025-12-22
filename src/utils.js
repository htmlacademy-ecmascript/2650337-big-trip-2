import dayjs from 'dayjs';
import {MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE} from './const.js';

export function humanizePointDueDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}
export function getDifferenceInTime(start, end) {
  const diffMs = dayjs(end).diff(dayjs(start));

  const days = Math.floor(diffMs / MILLISECONDS_IN_DAY);
  const hours = Math.floor((diffMs % MILLISECONDS_IN_DAY) / MILLISECONDS_IN_HOUR);
  const minutes = Math.floor((diffMs % MILLISECONDS_IN_HOUR) / MILLISECONDS_IN_MINUTE);

  if (diffMs < MILLISECONDS_IN_HOUR) {
    return `${minutes}M`;
  }
  if (diffMs < MILLISECONDS_IN_DAY) {
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
}
export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}
export function getRandomInteger(minValue, maxValue) {
  const lower = Math.ceil(Math.min(minValue, maxValue));
  const upper = Math.floor(Math.max(minValue, maxValue));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

export function getRandomId() {
  return crypto.randomUUID();
}
export function getRandomDates(startDate, endDate) {
  const hoursDuration = getRandomInteger(1, 48) ;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const dateStart = new Date(start + Math.random() * (end - start));
  const dateEnd = new Date(dateStart.getTime() + hoursDuration * MILLISECONDS_IN_HOUR);
  return {dateStart, dateEnd};
}

export function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
