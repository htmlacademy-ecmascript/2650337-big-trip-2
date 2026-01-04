export const CITIES = ['New York','Seoul','Hong Kong','Da Nang','Brescia','Chicago', 'Oslo', 'Frankfurt', 'Boston'];
export const pointTypes = ['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];
export const DATE_FORMAT = {
  DAY_MONTH: 'D MMM',
  MONTH_DAY: 'MMM DD',
  HOUR_MINUTES: 'HH:mm',
  DAY_MONTH_YEAR_TIME: 'DD/MM/YY[&nbsp;]HH:mm',
};
export const MILLISECONDS_IN_MINUTE = 60000;
export const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * 60;
export const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * 24;
export const DURATION = {
  HOUR:5,
  DAY:5,
  MIN:59
};
export const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
export const SORT_TYPES = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};
export const SORT_ITEMS = [
  { type: SORT_TYPES.DAY, label: 'Day', isDisabled: false, isChecked: true },
  { type: SORT_TYPES.EVENT, label: 'Event', isDisabled: true, isChecked: false },
  { type: SORT_TYPES.TIME, label: 'Time', isDisabled: false, isChecked: false },
  { type: SORT_TYPES.PRICE, label: 'Price', isDisabled: false, isChecked: false },
  { type: SORT_TYPES.OFFER, label: 'Offers', isDisabled: true, isChecked: false }
];
export const EMPTY_MESSAGES = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no past events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};
export const MODES = {
  DEFAULT: 'default',
  EDITING: 'editing',
};
