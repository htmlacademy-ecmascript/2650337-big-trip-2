import FiltersView from '../views/filters-view.js';
import { render, replace } from '../framework/render.js';
import TripInfoPresenter from './trip-info-presenter.js';

export default class FilterPresenter {
  #filterModel = null;
  #pointModel = null;
  #container = null;
  #filterComponent = null;
  #infoComponent = null;
  #infoContainer = document.querySelector('.trip-main');

  constructor({ filterModel, pointModel, container }) {
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;
    this.#container = container;

    this.#pointModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderInfo();
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

  #handleModelChange = () => {
    this.init();
  };

  #renderInfo() {
    if (!this.#infoComponent) {
      this.#infoComponent = new TripInfoPresenter({container: this.#infoContainer, pointModel: this.#pointModel});
    }
    this.#infoComponent.init();
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };
}
