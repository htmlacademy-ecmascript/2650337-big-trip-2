import PointView from '../views/point-view.js';
import NewFormView from '../views/new-form-view.js';
import { render, replace } from '../framework/render.js';
import {MODES} from '../const.js';

export default class PointPresenter {
  #point = null;
  #offers = null;
  #destination = null;
  #destinations = [];
  #container = null;
  #handleDataChange = () => null;
  #handleModeChange = () => null;

  #pointComponent = null;
  #formComponent = null;
  #mode = MODES.DEFAULT;
  #escKeydownHandler = null;

  constructor({ point, offers, destination, destinations, container, onDataChange, onModeChange}) {
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#destinations = destinations;
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init() {
    this.#renderPoint();
  }

  updatePoint(updatedPoint) {
    this.#point = updatedPoint;

    const prevPointComponent = this.#pointComponent;
    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onOpenClick: this.#handleOpenClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    if (this.#mode === MODES.DEFAULT && prevPointComponent) {
      replace(this.#pointComponent, prevPointComponent);
    }
  }

  #renderPoint() {
    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onOpenClick: this.#handleOpenClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    render(this.#pointComponent, this.#container);
  }

  #replacePointToForm() {
    this.#handleModeChange();

    this.#formComponent = new NewFormView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      destinations: this.#destinations,
      onSubmit: this.#handleFormSubmit,
      onClose: this.#handleFormClose
    });

    replace(this.#formComponent, this.#pointComponent);
    this.#mode = MODES.EDITING;

    this.#escKeydownHandler = this.#onEscKeydown.bind(this);
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formComponent);
    this.#mode = MODES.DEFAULT;
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  #handleOpenClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    };

    this.#handleDataChange?.(updatedPoint);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleFormClose = () => {
    this.#replaceFormToPoint();
  };

  #onEscKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  }

  resetView() {
    if (this.#mode === MODES.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    if (this.#formComponent) {
      this.#formComponent.element.remove();
    }
    if (this.#pointComponent) {
      this.#pointComponent.element.remove();
    }
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }
}
