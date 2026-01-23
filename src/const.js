export const pointTypes = ['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];
export const DATE_FORMAT = {
  DAY_MONTH: 'D MMM',
  MONTH_DAY: 'MMM DD',
  HOUR_MINUTES: 'HH:mm',
  DAY_MONTH_YEAR_TIME: 'DD/MM/YY[&nbsp;]HH:mm',
  FLATPICKR: 'd/m/y H:i',
};
export const MILLISECONDS_IN_MINUTE = 60000;
export const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * 60;
export const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * 24;
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
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};
export const LOAD_MESSAGES = {
  LOADING: 'Loading...',
  FAILED_LOAD: 'Failed to load latest route information',
};
export const BUTTON_TYPES = {
  NEW_FORM: 'Cancel',
  EXISTING_FORM: 'Delete',
};
export const MODES = {
  DEFAULT: 'default',
  EDITING: 'editing',
};
export const EMPTY_POINT = {
  id: crypto.randomUUID(),
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: '',
  offers: [],
  type: 'flight',
  isFavorite: false,
};
export const FLATPICKR_BASE_OPTIONS = {
  enableTime: true,
  dateFormat: DATE_FORMAT.FLATPICKR,
};
export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};
