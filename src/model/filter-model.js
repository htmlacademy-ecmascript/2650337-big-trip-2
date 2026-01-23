import { FILTER_TYPES } from '../const.js';

export default class FilterModel {
  #currentFilter = FILTER_TYPES.EVERYTHING;
  #observers = new Set();

  getFilter() {
    return this.#currentFilter;
  }

  setFilter(filterType) {
    if (this.#currentFilter === filterType) {
      return;
    }
    this.#currentFilter = filterType;
    this.#notify();
  }

  addObserver(callback) {
    this.#observers.add(callback);
  }

  #notify() {
    this.#observers.forEach((callback) => callback());
  }
}
