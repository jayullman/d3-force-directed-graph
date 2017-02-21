
// url from which to receive json data
const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

import getJson from './getJson';

// dataset is a promise for the requested json dataset
let promisedData = getJson(url);

function dataReceived() {
  console.log('done!');
}

promisedData
  .then((dataset) => console.log(dataset))
  .catch(error => console.log(error));