import ApiService from '../framework/api-service.js';

export default class Api extends ApiService {
  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse)
      .then((points) => points.map((point) => this.#adaptPointToClient(point)));
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.checkStatus)
      .then(ApiService.parseResponse)
      .then((updatedPoint) => this.#adaptPointToClient(updatedPoint));
  }

  addPoint(point) {
    return this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.checkStatus)
      .then(ApiService.parseResponse)
      .then((createdPoint) => this.#adaptPointToClient(createdPoint));
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: 'DELETE',
    })
      .then(ApiService.checkStatus);
  }

  #adaptPointToClient(point) {
    return {
      ...point,
      basePrice: point.base_price,
      dateFrom: new Date(point.date_from),
      dateTo: new Date(point.date_to),
      isFavorite: point.is_favorite,
    };
  }

  #adaptPointToServer(point) {
    /* eslint-disable camelcase */
    return {
      base_price: point.basePrice,
      date_from: point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
      date_to: point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
      destination: point.destination,
      is_favorite: point.isFavorite,
      offers: point.offers,
      type: point.type,
    };
    /* eslint-enable camelcase */
  }
}
