import NewFormView from '../views/new-form-view.js';
import EventsListView from '../views/events-list-view.js';
import PointView from '../views/point-view.js';
import SortView from '../views/sort-view.js';
import FiltersView from '../views/filters-view.js';

import { render, replace } from '../framework/render.js';

export default class MainPresenter {
  sortComponent = new SortView();
  listComponent = new EventsListView();
  #pointComponents = new Map();
  #formComponents = new Map();
  #currentFormId = null;
  #escKeydownHandler = null;

  constructor({ filterElement, tripElement, pointModel }) {
    this.filterElement = filterElement;
    this.tripElement = tripElement;
    this.pointModel = pointModel;
  }

  init() {
    this.points = [...this.pointModel.getPoints()];

    render(new FiltersView(), this.filterElement);
    render(this.sortComponent, this.tripElement);
    render(this.listComponent, this.tripElement);

    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i]);
    }
  }

  #renderPoint(point) {
    const pointComponent = new PointView({
      point: point,
      destination: this.pointModel.getDestinationById(point.destination),
      offers: this.pointModel.getOffersByType(point.type),
      onArrowClick: () => this.#replacePointToForm(point.id)
    });

    this.#pointComponents.set(point.id, pointComponent);
    render(pointComponent, this.listComponent.element);
  }

  #replacePointToForm(pointId) {
    const pointComponent = this.#pointComponents.get(pointId);
    const point = this.points.find((pointItem) => pointItem.id === pointId);

    if (!pointComponent || !point) {
      return;
    }

    const formComponent = new NewFormView({
      point: point,
      destination: this.pointModel.getDestinationById(point.destination),
      offers: this.pointModel.getOffersByType(point.type),
      onSubmit: () => {
        this.#replaceFormToPoint(pointId);
      },
      onClose: () => {
        this.#replaceFormToPoint(pointId);
      }
    });

    replace(formComponent, pointComponent);

    this.#formComponents.set(pointId, formComponent);
    this.#pointComponents.delete(pointId);
    this.#currentFormId = pointId;

    this.#escKeydownHandler = this.#onEscKeydown.bind(this);
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #replaceFormToPoint(pointId) {
    const formComponent = this.#formComponents.get(pointId);
    const point = this.points.find((pointItem) => pointItem.id === pointId);

    if (!formComponent || !point) {
      return;
    }

    const pointComponent = new PointView({
      point: point,
      destination: this.pointModel.getDestinationById(point.destination),
      offers: this.pointModel.getOffersByType(point.type),
      onArrowClick: () => this.#replacePointToForm(pointId)
    });

    replace(pointComponent, formComponent);

    this.#pointComponents.set(pointId, pointComponent);
    this.#formComponents.delete(pointId);
    this.#currentFormId = null;
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  #onEscKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      if (this.#currentFormId) {
        this.#replaceFormToPoint(this.#currentFormId);
      }
    }
  }
}
