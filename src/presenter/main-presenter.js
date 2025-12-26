import PointPresenter from './point-presenter.js';
import EventsListView from '../views/events-list-view.js';
import SortView from '../views/sort-view.js';
import FiltersView from '../views/filters-view.js';
import EmptyListView from '../views/empty-list-view.js';

import { render } from '../framework/render.js';
import { SORT_ITEMS, FILTER_TYPES, EMPTY_MESSAGES } from '../const.js';

const currentFilterType = FILTER_TYPES.EVERYTHING;
const defaultMessage = EMPTY_MESSAGES.EVERYTHING;

export default class MainPresenter {
  listComponent = new EventsListView();
  #pointPresenters = new Map();
  #emptyMessage = defaultMessage;

  constructor({ filterElement, tripElement, pointModel }) {
    this.filterElement = filterElement;
    this.tripElement = tripElement;
    this.pointModel = pointModel;
  }

  init() {
    const points = this.pointModel.getPoints();

    if (points.length === 0) {
      render(new EmptyListView(this.#emptyMessage), this.tripElement);
      return;
    }

    const filters = this.pointModel.getFilters();
    render(new FiltersView({ filters, currentFilterType }), this.filterElement);
    render(new SortView(SORT_ITEMS), this.tripElement);
    render(this.listComponent, this.tripElement);

    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      point: point,
      destination: this.pointModel.getDestinationById(point.destination),
      offers: this.pointModel.getOffersByType(point.type),
      destinations: this.pointModel.getDestinations(),
      container: this.listComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    const isUpdated = this.pointModel.updatePoint(updatedPoint);

    if (isUpdated) {
      const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
      if (pointPresenter) {
        pointPresenter.updatePoint(updatedPoint);
      }
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  destroy() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
