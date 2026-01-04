import PointPresenter from './point-presenter.js';
import EventsListView from '../views/events-list-view.js';
import SortView from '../views/sort-view.js';
import FiltersView from '../views/filters-view.js';
import EmptyListView from '../views/empty-list-view.js';

import { render } from '../framework/render.js';
import { SORT_ITEMS, SORT_TYPES, FILTER_TYPES, EMPTY_MESSAGES } from '../const.js';
import {sortPoints} from '../utils.js';

const currentFilterType = FILTER_TYPES.EVERYTHING;
const defaultMessage = EMPTY_MESSAGES.EVERYTHING;

export default class MainPresenter {
  #listComponent = new EventsListView();
  #pointPresenters = new Map();
  #emptyMessage = defaultMessage;
  #sortComponent = null;
  #currentSortType = SORT_TYPES.DAY;
  #points;

  constructor({ filterElement, tripElement, pointModel }) {
    this.filterElement = filterElement;
    this.tripElement = tripElement;
    this.pointModel = pointModel;
  }

  init() {
    this.#points = this.pointModel.getPoints();

    if (this.#points.length === 0) {
      render(new EmptyListView(this.#emptyMessage), this.tripElement);
      return;
    }

    const filters = this.pointModel.getFilters();
    render(new FiltersView({ filters, currentFilterType }), this.filterElement);

    this.#sortComponent = new SortView(
      SORT_ITEMS,
      this.#handleSortTypeChange,
    );
    render(this.#sortComponent, this.tripElement);

    render(this.#listComponent, this.tripElement);

    this.#renderPoints(this.#points);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      point: point,
      destination: this.pointModel.getDestinationById(point.destination),
      offers: this.pointModel.getOffersByType(point.type),
      destinations: this.pointModel.getDestinations(),
      container: this.#listComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #getSortedPoints() {
    switch (this.#currentSortType) {
      case SORT_TYPES.DAY:
        this.#points.sort(sortPoints[SORT_TYPES.DAY]);
        break;
      case SORT_TYPES.TIME:
        this.#points.sort(sortPoints[SORT_TYPES.TIME]);
        break;
      case SORT_TYPES.PRICE:
        this.#points.sort(sortPoints[SORT_TYPES.PRICE]);
        break;
    }
    return this.#points;
  }

  #handlePointChange = (updatedPoint) => {
    const isUpdated = this.pointModel.updatePoint(updatedPoint);

    if (isUpdated) {
      this.#clearPoints();
      this.#renderPoints(this.#getSortedPoints());
    }

  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearPoints();
      this.#renderPoints(this.#getSortedPoints());
    }
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  destroy() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
