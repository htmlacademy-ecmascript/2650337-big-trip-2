import MainPresenter from './presenter/main-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import Api from './api/api.js';

import LoadMessageView from './views/load-message-view.js';
import { render, remove } from './framework/render.js';
import {LOAD_MESSAGES} from './const.js';

const AUTHORIZATION = `Basic ${crypto.randomUUID()}`;
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const filterElement = document.querySelector('.trip-controls__filters');
const tripElement = document.querySelector('.trip-events');

const pointModel = new PointModel(api);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterModel,
  pointModel,
  container: filterElement,
});

const mainPresenter = new MainPresenter({
  tripElement: tripElement,
  pointModel: pointModel,
  filterModel: filterModel,
});

async function initApp() {
  const loadingMessage = new LoadMessageView(LOAD_MESSAGES.LOADING);
  render(loadingMessage, tripElement);

  const ok = await pointModel.init();
  remove(loadingMessage);

  if(!ok) {
    render(new LoadMessageView(LOAD_MESSAGES.FAILED_LOAD), tripElement);
    return;
  }

  filterPresenter.init();
  mainPresenter.init();
}
initApp().catch(() => {});
