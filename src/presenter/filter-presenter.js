import FiltersView from '../views/filters-view.js';
import { render, replace } from '../framework/render.js';

export default class FilterPresenter {
  #filterModel = null;
  #pointModel = null;
  #container = null;
  #filterComponent = null;

  constructor({ filterModel, pointModel, container }) {
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;
    this.#container = container;
  }

  init() {
    const filters = this.#pointModel.getFilters();
    const currentFilterType = this.#filterModel.getFilter();

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters,
      currentFilterType,
      onFilterChange: this.#handleFilterChange,
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#container);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
    }
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };
}
