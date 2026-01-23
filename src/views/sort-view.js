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
            data-sort-type="${item.type}"
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
  #sortTypeChangeHandler;

  constructor(sortItems, onSortTypeChange) {
    super();
    this.#sortItems = sortItems;
    this.#sortTypeChangeHandler = onSortTypeChange;

    this.element.addEventListener('change', this.#sortChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortItems);
  }

  #sortChangeHandler = (evt) => {
    if (!evt.target.dataset.sortType) {
      return;
    }

    evt.preventDefault();
    this.#sortTypeChangeHandler(evt.target.dataset.sortType);
  };
}
