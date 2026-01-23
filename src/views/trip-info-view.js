import AbstractView from '../framework/view/abstract-view.js';

function createInfoTemplate({ tripTitle, datesRange, totalCost, isEmpty }) {
  let info = '';

  if (!isEmpty) {
    info = `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>
        <p class="trip-info__dates">${datesRange}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    `;
  }

  return `
    <section class="trip-main__trip-info trip-info">
      ${info}
    </section>
  `;
}
export default class TripInfoView extends AbstractView {
  #data = {};
  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createInfoTemplate(this.#data);
  }
}
