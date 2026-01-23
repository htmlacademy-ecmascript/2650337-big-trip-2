import NewFormView from '../views/new-form-view.js';
import {render, remove} from '../framework/render.js';
import {EMPTY_POINT, BUTTON_TYPES} from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #destinations = [];
  #allOffers = null;

  #handleDataChange = () => {
  };

  #handleDestroy = () => {
  };

  #formComponent = null;

  constructor({container, destinations, allOffers, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {

    const emptyPoint = {
      ...EMPTY_POINT,
      id: crypto.randomUUID(),
      destination: '',
      offers: [],
    };

    this.#formComponent = new NewFormView({
      point: emptyPoint,
      destination: null,
      allOffers: this.#allOffers,
      destinations: this.#destinations,
      onSubmit: this.#handleFormSubmit,
      onClose: this.#handleFormCancel,
      onDelete: this.#handleFormCancel,
      buttonType: BUTTON_TYPES.NEW_FORM,
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

  #handleFormSubmit = async (point) => {


    this.#formComponent.setSaving();

    try {
      await this.#handleDataChange(point);


      this.destroy();
    } catch {
      this.#formComponent.setAborting();


    }
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
}
