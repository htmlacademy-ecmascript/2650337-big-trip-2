import AbstractView from '../framework/view/abstract-view.js';
import {FILTER_TYPES} from '../const.js';
import {capitalizeString} from '../utils.js';

const isChecked = (filterType, currentFilterType) => filterType === currentFilterType ? 'checked' : '';
const isDisabled = (filterCount) => filterCount === 0 ? 'disabled' : '';
const countAmount = (filterCount) => filterCount > 0 ? ` (${filterCount})` : '';

function createFiltersTemplate(filters, currentFilterType = FILTER_TYPES.EVERYTHING) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => `
        <div class="trip-filters__filter">
          <input
            id="filter-${filter.type}"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="${filter.type}"
            ${isChecked(filter.type, currentFilterType)}
            ${isDisabled(filter.count)}>
          <label class="trip-filters__filter-label" for="filter-${filter.type}">
            ${capitalizeString(filter.type)}
            ${countAmount(filter.count)}
          </label>
        </div>`).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FiltersView extends AbstractView {
  #filters = [];
  #currentFilterType;
  #handleFilterChange = () => {};

  constructor({ filters, currentFilterType = FILTER_TYPES.EVERYTHING, onFilterChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('change', (evt) => {
      evt.preventDefault();
      this.#handleFilterChange(evt.target.value);
    });
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }


}

