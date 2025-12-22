import {getRandomInteger, getRandomId} from '../utils.js';
import {pointTypes, TYPE_OFFERS, PRICE} from './mock-const.js';

export function getOffers() {
  const mockOffers = [];
  pointTypes.forEach((type) => {
    const allOffersByType = [];
    if (TYPE_OFFERS[type]) {
      const offers = TYPE_OFFERS[type];
      for(let i = 0; i < offers.length; i++){
        const offerByType = {
          'id': getRandomId(),
          'title': offers[i],
          'price': getRandomInteger(PRICE.MIN, PRICE.MAX)
        };
        allOffersByType.push(offerByType);
      }
      const offersByType = {
        'type': type,
        'offers': allOffersByType
      };
      mockOffers.push(offersByType);
    }
  });
  return mockOffers;
}
