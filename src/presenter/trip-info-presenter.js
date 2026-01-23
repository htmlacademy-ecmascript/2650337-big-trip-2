import TripInfoView from '../views/trip-info-view.js';
import { render, replace } from '../framework/render.js';
import {DATE_FORMAT, RenderPosition, SORT_TYPES} from '../const.js';
import {sortPoints} from '../utils.js';
import dayjs from 'dayjs';

export default class TripInfoPresenter {
  #container = null;
  #pointModel = null;
  #tripInfoComponent = null;

  constructor({ container, pointModel }) {
    this.#container = container;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#render();
  }

  #handleModelChange = () => {
    this.#render();
  };

  #render() {
    const data = this.#getTripInfoData();

    const prev = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView(data);

    if(prev) {
      replace(this.#tripInfoComponent, prev);
    } else {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
    }
  }

  #getTripInfoData() {
    const points = this.#pointModel.getPoints();

    if (points?.length > 0) {
      const sortedPoints = [...points].sort(sortPoints[SORT_TYPES.DAY]);
      return {
        isEmpty: false,
        tripTitle: this.#buildTripTitle(sortedPoints),
        datesRange: this.#formatTripDates(sortedPoints),
        totalCost: this.#calculateTotalCost(sortedPoints),
      };
    }
    return {
      isEmpty: true,
      tripTitle: '',
      datesRange: '',
      totalCost: '',
    };
  }

  #buildTripTitle(points) {
    const cities = points.map((point) => this.#pointModel.getDestinationById(point.destination)?.name)
      .filter(Boolean);
    const uniqueCities = cities.filter((city, index) => city !== cities[index - 1]);
    if (uniqueCities.length === 0) {
      return '';
    }
    if (uniqueCities.length <= 3) {
      return uniqueCities.join(' — ');
    }
    return `${uniqueCities[0]} — ... — ${uniqueCities[uniqueCities.length - 1]}`;
  }

  #formatTripDates(points) {
    const startDate = dayjs(points[0].dateFrom);
    const endDate = dayjs(points[points.length - 1].dateTo);

    return `${startDate.format(DATE_FORMAT.DAY_MONTH)} — ${endDate.format(DATE_FORMAT.DAY_MONTH)}`;
  }

  #calculateTotalCost(points) {
    const allOffers = this.#pointModel.getAllOffers();

    return points.reduce((sum, point) => {
      const base = Number(point.basePrice) || 0;

      const offersByType = allOffers.find((offer) => offer.type === point.type);
      const offersList = offersByType?.offers ?? [];

      const selectedOffersCost = offersList
        .filter((offer) => point.offers.includes(offer.id))
        .reduce((acc, offer) => acc + (Number(offer.price) || 0), 0);

      return sum + base + selectedOffersCost;
    }, 0);
  }

}
