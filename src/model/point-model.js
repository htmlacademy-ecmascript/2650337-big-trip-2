import { generateFilter } from '../utils.js';

export default class PointModel {
  #points = [];
  #offers = [];
  #destinations = [];
  #observers = new Set();
  #api = null;

  constructor(api) {
    this.#api = api;
  }

  addObserver(callback) {
    this.#observers.add(callback);
  }

  #notify() {
    this.#observers.forEach((callback) => callback());
  }

  getPoints() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = points;
    this.#notify();
  }

  getAllOffers() {
    return this.#offers;
  }

  setOffers(offers) {
    this.#offers = offers;
    this.#notify();
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }

  getDestinations() {
    return this.#destinations;
  }

  setDestinations(destinations) {
    this.#destinations = destinations;
    this.#notify();
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

  async addPoint(point) {
    const createdPoint = await this.#api.addPoint(point);
    this.#points = [...this.#points, createdPoint];
    this.#notify();
  }

  async updatePoint(point) {
    const updatedPoint = await this.#api.updatePoint(point);
    this.#points = this.#points.map((p) => p.id === updatedPoint.id ? updatedPoint : p);
    this.#notify();
  }

  async deletePoint(point) {
    await this.#api.deletePoint(point);
    this.#points = this.#points.filter((p) => p.id !== point.id);
    this.#notify();
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#api.points,
        this.#api.destinations,
        this.#api.offers,
      ]);

      this.setPoints(points);
      this.setDestinations(destinations);
      this.setOffers(offers);

      return true;
    } catch (e) {
      return false;
    }
  }
}

