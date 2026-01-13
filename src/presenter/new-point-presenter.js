import NewFormView from '../views/new-form-view.js';
import {render, remove} from '../framework/render.js';

export default class NewPointPresenter {
  #container = null;
  #destinations = [];
  #allOffers = null;

  #handleDataChange = () => {};
  #handleDestroy = () => {};

  #formComponent = null;

  constructor({ container, destinations, allOffers, onDataChange, onDestroy }) {
    this.#container = container;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#formComponent !== null) {
      return;
    }

    const point = this.#createEmptyPoint();
    const offersByType = this.#allOffers.find(
      (offer) => offer.type === point.type
    );

    this.#formComponent = new NewFormView({
      point: this.#createEmptyPoint(),
      destination: this.#destinations[0],
      offers: offersByType,
      allOffers: this.#allOffers,
      destinations: this.#destinations,
      onSubmit: this.#handleFormSubmit,
      onClose: this.#handleFormCancel,
      onDelete: this.#handleFormCancel,
    });

    render(this.#formComponent, this.#container, 'afterbegin');

    document.addEventListener('keydown', this.#onEscKeydown);
  }

  destroy() {
    if (this.#formComponent === null) {
      return;
    }

    remove(this.#formComponent);
    this.#formComponent = null;

    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#handleDestroy();
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.destroy();
  };

  #handleFormCancel = () => {
    this.destroy();
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #createEmptyPoint() {
    return {
      id: crypto.randomUUID(),
      basePrice: 0,
      dateFrom: new Date(),
      dateTo: new Date(),
      destination: this.#destinations[0].id,
      offers: [],
      type: 'flight',
      isFavorite: false,
    };
  }

}
