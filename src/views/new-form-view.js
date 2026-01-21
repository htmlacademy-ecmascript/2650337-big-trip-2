import { pointTypes, DATE_FORMAT, FLATPICKR_BASE_OPTIONS} from '../const.js';
import { humanizePointDueDate, capitalizeString } from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


function createTypeItemTemplate(id, pointType, checkedType) {
  const isCheckedType = checkedType === pointType ? 'checked' : '';
  return `<div class="event__type-item">
              <input id="event-type-${pointType}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${isCheckedType}>
                <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${id}">${capitalizeString(pointType)}</label>
            </div>`;
}
function createOffersTemplate(offers, checkedOffersId) {
  const { id, title, price } = offers;
  const isCheckedOffers = checkedOffersId.includes(id) ? 'checked' : '';
  return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id=${id} type="checkbox" name=${id} ${isCheckedOffers}>
      <label class="event__offer-label" for=${id}>
        <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
}
function createOfferListTemplate(offers, checkedOffersId) {
  return offers.length > 0 ?
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offers.map((offer) => createOffersTemplate(offer, checkedOffersId)).join('')}
        </div>
      </section>`
    : '';
}

function createPhotosTemplate(pictures) {
  return pictures.length > 0 ?
    `<div class="event__photos-container">
<div class="event__photos-tape">
 ${pictures.map(({ src, description }) =>
    `<img class="event__photo" src="${src}" alt="${description}">`
  ).join('')}
    </div>
</div>`
    : '';
}

function createDescriptionTemplate(description) {
  return description.length > 0 ? `<section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${description}</p>` : '';
}

function createNewFormTemplate(point, offers, destination, destinations, buttonType) {
  const { id, basePrice, dateFrom, dateTo, offers: checkedOffersId, type } = point;
  const name = destination?.name ?? '';
  const description = destination?.description ?? '';
  const pictures = destination?.pictures ?? [];
  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${pointTypes.map((pointType) => createTypeItemTemplate(id, pointType, type)).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${id}">
                     ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
                    <datalist id="destination-list-${id}">
                    ${destinations.map((destinationItem) => `<option value='${destinationItem.name}'></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFrom ? humanizePointDueDate(dateFrom, DATE_FORMAT.DAY_MONTH_YEAR_TIME) : ''}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${id}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateTo ? humanizePointDueDate(dateTo, DATE_FORMAT.DAY_MONTH_YEAR_TIME) : ''}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="button">${buttonType}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                ${createOfferListTemplate(offers.offers, checkedOffersId)}
                    ${createDescriptionTemplate(description)}
                   ${createPhotosTemplate(pictures)}
                </section>
                </section >
            </form >
          </li > `;
}

export default class NewFormView extends AbstractStatefulView {
  _state = null;
  #destinations;
  #allOffers = null;
  #handleSubmit = () => {};
  #handleClose = () => {};
  #handleDelete = () => {};
  #dateFromPicker = null;
  #dateToPicker = null;
  #buttonType = '';

  constructor({ point, allOffers, destination, onSubmit, onClose, onDelete, destinations, buttonType}) {
    super();

    this._state = {
      point: point,
      destination: destination,
    };
    this.#allOffers = allOffers;
    this.#handleSubmit = onSubmit;
    this.#handleClose = onClose;
    this.#handleDelete = onDelete;
    this.#destinations = destinations;
    this.#buttonType = buttonType;
    this._restoreHandlers();
  }

  get template() {
    this._state.offers = this.#getOffersByType();
    return createNewFormTemplate(
      this._state.point,
      this._state.offers,
      this._state.destination,
      this.#destinations,
      this.#buttonType,
    );
  }

  #getOffersByType() {
    return this.#allOffers.find(
      (offer) => offer.type === this._state.point.type
    );
  }

  #initHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteHandler);
  }

  #setDatePickers() {
    const { dateFrom, dateTo, id } = this._state.point;

    this.#dateFromPicker = flatpickr(
      this.element.querySelector(`#event-start-time-${id}`),
      {
        ...FLATPICKR_BASE_OPTIONS,
        defaultDate: dateFrom ?? null,
        onChange: ([userDate]) => {
          this._state.point.dateFrom = userDate;
          const currentTo = this._state.point.dateTo;

          if (!currentTo || currentTo < userDate) {
            this._state.point.dateTo = userDate;
            this.#dateToPicker.setDate(userDate);
          }

          this.#dateToPicker.set('minDate', userDate);
        },
      }
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector(`#event-end-time-${id}`),
      {
        ...FLATPICKR_BASE_OPTIONS,
        defaultDate: dateTo ?? null,
        minDate: dateFrom ?? null,
        onChange: ([userDate]) => {
          this._state.point.dateTo = userDate;
        },
      }
    );
  }

  setSaving() {
    this.#setDisabled(true);
    this.element.querySelector('.event__save-btn').textContent = 'Saving...';
  }

  setDeleting() {
    this.#setDisabled(true);
    this.element.querySelector('.event__reset-btn').textContent = 'Deleting...';
  }

  setAborting() {
    this.#setDisabled(false);
    this.element.querySelector('.event__save-btn').textContent = 'Save';
    this.element.querySelector('.event__reset-btn').textContent = this.#buttonType;
    this.shake();
  }

  #setDisabled(isDisabled) {
    this.element.querySelectorAll('input, textarea, select').forEach((el) => {
      el.disabled = isDisabled;
    });

    this.element.querySelector('.event__save-btn').disabled = isDisabled;

    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    rollupBtn.disabled = false;
    rollupBtn.removeAttribute('disabled');

    const resetBtn = this.element.querySelector('.event__reset-btn');
    resetBtn.disabled = false;
    resetBtn.removeAttribute('disabled');

    this.element.dataset.blocked = String(isDisabled);
  }

  #destroyDatePickers() {
    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  }


  #submitHandler = (evt) => {
    evt.preventDefault();

    if (this.element.querySelector('.event__save-btn').disabled) {
      return;
    }

    const destinationInput =
      this.element.querySelector('.event__input--destination').value;

    const isValidDestination = this.#destinations.some(
      (destination) => destination.name === destinationInput
    );

    if (!isValidDestination) {
      return;
    }

    const priceValue = Number(
      this.element.querySelector('.event__input--price').value
    );

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      return;
    }

    this.#handleSubmit({
      ...this._state.point,
      basePrice: priceValue,
      destination: this._state.destination.id,
      offers: this._state.point.offers,
    });
  };

  #closeHandler = (evt) => {
    evt.preventDefault();

    if (this.element.querySelector('.event__save-btn').disabled) {
      return;
    }

    this.#handleClose();
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();

    if (this.element.querySelector('.event__save-btn').disabled) {
      return;
    }

    this.#handleDelete(this._state.point);
  };


  #handleTypeChange = (evt) => {
    const newType = evt.target.value;
    const newOffers = {
      type: newType,
      offers: this.#allOffers.find((allOffers) => allOffers.type === newType).offers
    };
    this.updateElement({
      point: {...this._state.point, type: newType, offers: []},
      offers: newOffers
    });
  };

  #handleDestinationChange = (evt) => {
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    if (newDestination) {
      this.updateElement({ destination: newDestination });
    }
  };

  #handleOffersChange = (evt) => {
    const offerId = evt.target.name;
    const checked = evt.target.checked;

    const currentOffers = this._state.point.offers;

    const nextOffers = checked
      ? [...currentOffers, offerId]
      : currentOffers.filter((id) => id !== offerId);

    this._setState({
      point: { ...this._state.point, offers: nextOffers },
    });
  };

  #handlePriceInput = (evt) => {
    const value = evt.target.value;

    const price = Number(value);

    this._setState({
      point: {
        ...this._state.point,
        basePrice: Number.isFinite(price) ? price : 0,
      },
    });
  };

  _restoreHandlers() {
    this.#destroyDatePickers();
    this.#initHandlers();
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', this.#handleTypeChange);
    });
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#handleDestinationChange);

    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#handleOffersChange);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#handlePriceInput);
    this.#setDatePickers();
  }
}
