import AbstractView from '../framework/view/abstract-view.js';

function createEmptyListTemplate(message) {
  return `
<p class="trip-events__msg">${message}</p>
  `;
}

export default class EmptyListView extends AbstractView {
  #message = '';
  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createEmptyListTemplate(this.#message);
  }
}
