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
  #isCreating = false;
  #listComponent = new EventsListView();
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #sortComponent = null;
  #currentSortType = SORT_TYPES.DAY;
  #emptyMessageComponent = null;
  #newEventButton = document.querySelector('.trip-main__event-add-btn');
  #api = null;


  constructor({ tripElement, pointModel, filterModel, api }) {
    this.tripElement = tripElement;
    this.pointModel = pointModel;
    this.filterModel = filterModel;
    this.#api = api;
  }

  init() {
    this.#newEventButton.addEventListener('click', this.#handleNewEventClick);

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
      canOpenForm: () => !this.#isCreating,
      onBeforeOpen: this.#beforeOpenPointForm,
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderSort() {
    const sortItems = this.#getSortItems();

    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView(sortItems, this.#handleSortTypeChange);

    if (!prevSortComponent) {
      render(this.#sortComponent, this.tripElement, 'afterbegin');
    } else {
      remove(prevSortComponent);
      render(this.#sortComponent, this.tripElement, 'afterbegin');
    }
  }


  #renderList() {
    if (!this.tripElement.contains(this.#listComponent.element)) {
      render (this.#listComponent, this.tripElement);
    }
  }

  #renderNewPointPresenter() {
    if (!this.#newPointPresenter) {
      this.#newPointPresenter = new NewPointPresenter({
        container: this.#listComponent.element,
        allOffers: this.pointModel.getAllOffers(),
        destinations: this.pointModel.getDestinations(),
        onDataChange: this.#handleNewPointSubmit,
        onDestroy: this.#handleNewPointDestroy,
      });
    }
  }

  #beforeOpenPointForm = () => {
    if (this.#isCreating) {
      this.#newPointPresenter.destroy();
    }
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderBoard() {
    const points = this.#getPoints();
    this.#clearPoints();

    if (this.#emptyMessageComponent) {
      remove(this.#emptyMessageComponent);
      this.#emptyMessageComponent = null;
    }

    if (points.length === 0) {
      if (this.#sortComponent) {
        remove(this.#sortComponent);
        this.#sortComponent = null;
      }

      this.#renderList();
      this.#renderNewPointPresenter();

      if (!this.#isCreating) {
        this.#renderEmptyList();
      }
      return;
    }

    this.#renderSort();

    this.#renderList();
    this.#renderNewPointPresenter();

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

  #getSortItems() {
    return SORT_ITEMS.map((item) => ({
      ...item,
      isChecked: item.type === this.#currentSortType,
    }));
  }

  #renderEmptyList() {
    const filterType = this.filterModel.getFilter().toUpperCase();
    const message = EMPTY_MESSAGES[filterType];
    this.#emptyMessageComponent = new EmptyListView(message);

    render(this.#emptyMessageComponent, this.tripElement);
  }

  #handlePointUpdate = async (updatedPoint) => {
    const response = await this.#api.updatePoint(updatedPoint);
    this.pointModel.updatePoint(response);
  };

  #handlePointDelete = async (point) => {
    await this.#api.deletePoint(point);
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

    if (this.#isCreating || this.#newEventButton.getAttribute('aria-disabled') === 'true') {
      return;
    }

    if (this.#emptyMessageComponent) {
      remove(this.#emptyMessageComponent);
      this.#emptyMessageComponent = null;
    }

    this.#currentSortType = SORT_TYPES.DAY;

    if (this.filterModel.getFilter() !== FILTER_TYPES.EVERYTHING) {
      this.filterModel.setFilter(FILTER_TYPES.EVERYTHING);
    }

    this.#renderList();
    this.#renderNewPointPresenter();

    this.#isCreating = true;
    this.#newPointPresenter.init();
    this.#newEventButton.disabled = true;
  };

  #handleNewPointSubmit = async (point) => {
    const createdPoint = await this.#api.addPoint(point);
    this.pointModel.addPoint(createdPoint);
    return createdPoint;
  };

  #handleNewPointDestroy = () => {
    this.#isCreating = false;
    this.#newEventButton.disabled = false;
    const points = this.#getPoints();
    if (points.length === 0) {
      if (this.#sortComponent) {
        remove(this.#sortComponent);
        this.#sortComponent = null;
      }

      if (!this.#emptyMessageComponent) {
        this.#renderEmptyList();
      }
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
