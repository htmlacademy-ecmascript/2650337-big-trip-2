import { pointTypes, DATE_FORMAT} from '../const.js';
import { humanizePointDueDate, capitalizeString } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

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
    `<div class="event__photos-tape">
 ${pictures.map(({ src, description }) =>
    `<img class="event__photo" src="${src}" alt="${description}">`
  ).join('')}
    </div>`
    : '';
}

function createDescriptionTemplate(description) {
  return description.length > 0 ? `<p class="event__destination-description">${description}</p>` : '';
}

function createNewFormTemplate(point, offers, destination, destinations) {
  const { id, basePrice, dateFrom, dateTo, offers: checkedOffersId, type } = point;
  const { name, description, pictures } = destination;
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
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value=${humanizePointDueDate(dateFrom, DATE_FORMAT.DAY_MONTH_YEAR_TIME)}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${id}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value=${humanizePointDueDate(dateTo, DATE_FORMAT.DAY_MONTH_YEAR_TIME)}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value=${basePrice}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                ${createOfferListTemplate(offers.offers, checkedOffersId)}
                <section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    ${createDescriptionTemplate(description)}
                <div class="event__photos-container">
                   ${createPhotosTemplate(pictures)}
                </div>
                </section>
                </section >
            </form >
          </li > `;
}

export default class NewFormView extends AbstractView {
  #point = null;
  #offers = null;
  #destination = null;
  #destinations;
  #handleSubmit;
  #handleClose;
  constructor({ point, offers, destination, onSubmit, onClose, destinations}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#handleSubmit = onSubmit;
    this.#handleClose = onClose;
    this.#destinations = destinations;
    this.element.querySelector('form')
      .addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeHandler);
  }

  get template() {
    return createNewFormTemplate(this.#point, this.#offers, this.#destination, this.#destinations);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit();
  };

  #closeHandler = (evt) => {
    evt.preventDefault();
    this.#handleClose();
  };
}
