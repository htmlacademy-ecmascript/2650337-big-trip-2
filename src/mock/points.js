import {getRandomInteger, getRandomId, getRandomArrayElement, getRandomDates} from '../utils.js';
import {getDestinations} from './destinations.js';
import {getOffers} from './offers.js';
import {PRICE, DATE_START, DATE_END} from './mock-const.js';
export const destinationsAll = getDestinations();
export const offersByType = getOffers();

export function getPoint() {
  const dates = getRandomDates(DATE_START, DATE_END);
  const destination = getRandomArrayElement(destinationsAll);
  const offerItem = getRandomArrayElement(offersByType);
  const { offers } = offerItem;
  const offer = getRandomArrayElement(offers);
  return {
    'id': getRandomId(),
    'base_price': getRandomInteger(PRICE.MIN, PRICE.MAX),
    'date_from': dates.dateStart,
    'date_to': dates.dateEnd,
    'destination': destination.id,
    'is_favorite': !!getRandomInteger(0, 1),
    'offers': [offer.id],
    'type': offerItem.type
  };
}
