import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate(sortItems) {
  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${sortItems.map((item) => `
        <div class="trip-sort__item trip-sort__item--${item.type}">
          <input
            id="sort-${item.type}"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-${item.type}"
            ${item.isChecked ? 'checked' : ''}
            ${item.isDisabled ? 'disabled' : ''}
          >
          <label class="trip-sort__btn" for="sort-${item.type}">${item.label}</label>
        </div>
      `).join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #sortItems = [];

  constructor(sortItems) {
    super();
    this.#sortItems = sortItems;
  }

  get template() {
    return createSortTemplate(this.#sortItems);
  }
}
