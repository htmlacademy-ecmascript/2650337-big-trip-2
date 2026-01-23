import AbstractView from '../framework/view/abstract-view.js';

function createLoadMessageTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class LoadMessageView extends AbstractView {
  #message = '';
  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createLoadMessageTemplate(this.#message);
  }
}
