import {POINTS_AMOUNT} from '../mock/mock-const.js';
import { getPoint, allDestinations, offersByType} from '../mock/points.js';
import { generateFilter } from '../utils.js';

function pointToCamelCase(point) {
  return {
    ...point,
    basePrice: point.base_price,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    isFavorite: point.is_favorite
  };
}

export default class PointModel {
  #points = Array.from({ length: POINTS_AMOUNT }, () => pointToCamelCase(getPoint()));
  #offers = offersByType;
  #destinations = allDestinations;

  getPoints() {
    return this.#points;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }

  getDestinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getFilters() {
    const points = this.getPoints();
    const filters = generateFilter(points);

    return filters.map((filter) => ({
      ...filter,
      isDisabled: filter.count === 0
    }));
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    if (index !== -1) {
      this.#points[index] = updatedPoint;
      return true;
    }
    return false;
  }
}
