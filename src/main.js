import MainPresenter from './presenter/main-presenter.js';
import PointModel from './model/point-model.js';

const filterElement = document.querySelector('.trip-controls__filters');
const tripElement = document.querySelector('.page-main .page-body__container');
const pointModel = new PointModel();

const mainPresenter = new MainPresenter({
  filterElement: filterElement,
  tripElement: tripElement,
  pointModel: pointModel,
});

mainPresenter.init();
