import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
import {MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE, FILTER_TYPES, SORT_TYPES} from './const.js';

export function humanizePointDueDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}
export function getDifferenceInTime(start, end) {
  const diffMs = dayjs(end).diff(dayjs(start));

  const days = Math.floor(diffMs / MILLISECONDS_IN_DAY);
  const hours = Math.floor((diffMs % MILLISECONDS_IN_DAY) / MILLISECONDS_IN_HOUR);
  const minutes = Math.floor((diffMs % MILLISECONDS_IN_HOUR) / MILLISECONDS_IN_MINUTE);

  if (diffMs < MILLISECONDS_IN_HOUR) {
    return `${String(minutes).padStart(2, '0')}M`;
  }
  if (diffMs < MILLISECONDS_IN_DAY) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
}

export function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const filter = {
  [FILTER_TYPES.EVERYTHING]: (points) => points,
  [FILTER_TYPES.FUTURE]: (points) => points.filter((point) => {
    const pointDateFrom = dayjs(point.date_from);
    const now = dayjs();
    return pointDateFrom.isAfter(now);
  }),
  [FILTER_TYPES.PRESENT]: (points) => points.filter((point) => {
    const pointDateFrom = dayjs(point.date_from);
    const pointDateTo = dayjs(point.date_to);
    const now = dayjs();
    return (pointDateFrom.isSame(now) || pointDateFrom.isBefore(now)) &&
      (pointDateTo.isSame(now) || pointDateTo.isAfter(now));
  }),
  [FILTER_TYPES.PAST]: (points) => points.filter((point) => {
    const pointDateTo = dayjs(point.date_to);
    const now = dayjs();
    return pointDateTo.isBefore(now);
  }),
};

export function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      count: filterPoints(points).length,
    })
  );
}

export const sortPoints = {
  [SORT_TYPES.DAY]: (a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)),
  [SORT_TYPES.PRICE]: (a, b) => b.basePrice - a.basePrice,
  [SORT_TYPES.TIME]: (a, b) => {
    const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
    const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));

    return durationB - durationA;
  },
};

export const filtersPoints = {
  [FILTER_TYPES.PAST]: (point, now) => dayjs(point.dateTo).isBefore(now),
  [FILTER_TYPES.PRESENT]: (point, now) => dayjs(point.dateFrom).isSameOrBefore(now) &&
    dayjs(point.dateTo).isSameOrAfter(now),
  [FILTER_TYPES.FUTURE]: (point, now) => dayjs(point.dateFrom).isAfter(now),
};
