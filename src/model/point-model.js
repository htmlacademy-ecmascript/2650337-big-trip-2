import {POINTS_AMOUNT} from '../mock/mock-const.js';
import { getPoint, allDestinations, offersByType} from '../mock/points.js';
import { generateFilter } from '../utils.js';

function transformPointToCamelCase(point) {
  return {
    ...point,
    basePrice: point.base_price,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    isFavorite: point.is_favorite
  };
}

export default class PointModel {
  #points = Array.from({ length: POINTS_AMOUNT }, () => transformPointToCamelCase(getPoint()));
  #offers = offersByType;
  #destinations = allDestinations;
  #observers = new Set();

  addObserver(callback) {
    this.#observers.add(callback);
  }

  removeObserver(callback) {
    this.#observers.delete(callback);
  }

  #notify() {
    this.#observers.forEach((callback) => callback());
  }

  getPoints() {
    return this.#points;
  }

  getAllOffers() {
    return this.#offers;
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

  addPoint(point) {
    this.#points.push(point);
    this.#notify();
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    if (index !== -1) {
      this.#points[index] = updatedPoint;
      this.#notify();
    }
  }

  deletePoint(point) {
    this.#points = this.#points.filter((p) => p.id !== point.id);
    this.#notify();
  }
}

