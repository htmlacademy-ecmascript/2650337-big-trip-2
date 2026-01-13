import MainPresenter from './presenter/main-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const filterElement = document.querySelector('.trip-controls__filters');
const tripElement = document.querySelector('.page-main .page-body__container');
const pointModel = new PointModel();
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

filterPresenter.init();
mainPresenter.init();
