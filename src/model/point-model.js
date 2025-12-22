import {POINTS_AMOUNT} from '../mock/mock-const.js';
import { getPoint, destinationsAll, offersByType} from '../mock/points.js';

export default class PointModel {
  points = Array.from({ length: POINTS_AMOUNT }, getPoint);
  offers = offersByType;
  destinations = destinationsAll;

  getPoints() {
    return this.points;
  }

  getOffersByType(type) {
    return this.offers.find((offer) => offer.type === type);
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }
}
