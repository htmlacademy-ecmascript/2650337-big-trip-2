import {getRandomInteger, getRandomId, getRandomArrayElement} from '../utils.js';
import {CITIES, DESCRIPTIONS, DESCRIPTIONS_AMOUNT, IMAGES_AMOUNT, PHOTOS_DESCRIPTIONS} from './mock-const.js';

const citiesList = [...CITIES];
const destinationsId = [];

const mockDestinations = [];
function getImages(name) {
  const images = [];
  for(let i = 0; i < (getRandomInteger(1, IMAGES_AMOUNT)); i++) {
    const image = {
      'src': `https://loremflickr.com/248/152?random=${getRandomInteger(1, 1000)}`,
      'description': name + getRandomArrayElement(PHOTOS_DESCRIPTIONS).toString()
    };
    images.push(image);
  }
  return images;
}

function getDestination() {
  const name = getRandomArrayElement(citiesList);
  const index = citiesList.indexOf(name);
  if (index !== -1) {
    citiesList.splice(index, 1);
  }
  const destinationID = getRandomId();
  destinationsId.push(destinationID.toString());
  return {
    'id': destinationID,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': name,
    'pictures': getImages(name)
  };
}

export function getDestinations() {
  for(let i = 0; i < DESCRIPTIONS_AMOUNT; i++) {
    mockDestinations.push(getDestination());
  }
  return mockDestinations;
}
