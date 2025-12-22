import AbstractView from '../framework/view/abstract-view.js';

function createFiltersTemplate(filters, currentFilterType = 'everything') {
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
            ${filter.type === currentFilterType ? 'checked' : ''}
            ${filter.count === 0 ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${filter.type}">
            ${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}
            ${filter.count > 0 ? ` (${filter.count})` : ''}
          </label>
        </div>`).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor({ filters, currentFilterType = 'everything' }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }
}
