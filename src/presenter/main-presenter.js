import dayjs from 'dayjs';

import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import EventsListView from '../views/events-list-view.js';
import SortView from '../views/sort-view.js';
import EmptyListView from '../views/empty-list-view.js';

import {remove, render} from '../framework/render.js';
import {SORT_ITEMS, SORT_TYPES, FILTER_TYPES, EMPTY_MESSAGES} from '../const.js';
import {sortPoints, filtersPoints} from '../utils.js';

export default class MainPresenter {
  #listComponent = new EventsListView();
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #sortComponent = null;
  #currentSortType = SORT_TYPES.DAY;
  #emptyView = null;
  #newEventButton = document.querySelector('.trip-main__event-add-btn');


  constructor({ tripElement, pointModel, filterModel }) {
    this.tripElement = tripElement;
    this.pointModel = pointModel;
    this.filterModel = filterModel;
  }

  init() {
    this.#newEventButton.addEventListener('click', this.#handleNewEventClick);
    this.#newPointPresenter = new NewPointPresenter({
      container: this.tripElement,
      pointModel: this.pointModel,
      allOffers: this.pointModel.getAllOffers(),
      destinations: this.pointModel.getDestinations(),
      onDataChange: this.#handleNewPointSubmit,
      onDestroy: this.#handleNewPointDestroy,
    });

    this.pointModel.addObserver(this.#handleModelChange);
    this.filterModel.addObserver(this.#handleModelChange);

    this.#renderBoard();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      point: point,
      destination: this.pointModel.getDestinationById(point.destination),
      allOffers: this.pointModel.getAllOffers(),
      offers: this.pointModel.getOffersByType(point.type),
      destinations: this.pointModel.getDestinations(),
      container: this.#listComponent.element,
      onDataChange: this.#handlePointUpdate,
      onModeChange: this.#handleModeChange,
      onPointDelete: this.#handlePointDelete,
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderSort() {
    this.#sortComponent = new SortView(
      SORT_ITEMS,
      this.#handleSortTypeChange,
    );
    render(this.#sortComponent, this.tripElement);
    render(this.#listComponent, this.tripElement);
  }

  #renderBoard() {
    const points = this.#getPoints();
    this.#clearPoints();

    if (this.#emptyView) {
      remove(this.#emptyView);
      this.#emptyView = null;
    }

    if (points.length === 0) {
      if (this.#sortComponent) {
        remove(this.#sortComponent);
        this.#sortComponent = null;
      }
      this.#renderEmptyList();
      return;
    }

    if (!this.#sortComponent) {
      this.#renderSort();
    }
    this.#renderPoints(points);
  }

  #filterPoints(points, filterType) {
    if (filterType === FILTER_TYPES.EVERYTHING) {
      return points;
    }

    const now = dayjs();

    return points.filter((point) =>
      filtersPoints[filterType](point, now)
    );
  }

  #getPoints() {
    const filterType = this.filterModel.getFilter();
    const points = this.pointModel.getPoints();

    const filteredPoints = this.#filterPoints(points, filterType);

    return this.#getSortedPoints(filteredPoints);
  }

  #getSortedPoints(points) {
    switch (this.#currentSortType) {
      case SORT_TYPES.DAY:
        return [...points].sort(sortPoints[SORT_TYPES.DAY]);
      case SORT_TYPES.TIME:
        return [...points].sort(sortPoints[SORT_TYPES.TIME]);
      case SORT_TYPES.PRICE:
        return [...points].sort(sortPoints[SORT_TYPES.PRICE]);
    }
  }

  #renderEmptyList() {
    const filterType = this.filterModel.getFilter().toUpperCase();
    const message = EMPTY_MESSAGES[filterType];
    this.#emptyView = new EmptyListView(message);

    render(this.#emptyView, this.tripElement);
  }

  #handlePointUpdate = (updatedPoint) => {
    this.pointModel.updatePoint(updatedPoint);

  };

  #handlePointDelete = (point) => {
    this.pointModel.deletePoint(point);
  };

  #handleModelChange = () => {
    this.#currentSortType = SORT_TYPES.DAY;
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#renderBoard();
    }
  };

  #handleNewEventClick = (evt) => {
    evt.preventDefault();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.init();
    this.#newEventButton.disabled = true;
  };

  #handleNewPointSubmit = (point) => {
    this.pointModel.addPoint(point);
  };

  #handleNewPointDestroy = () => {
    this.#newEventButton.disabled = false;
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
