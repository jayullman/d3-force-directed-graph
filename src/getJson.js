// use axios to request json data from:
// https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json

import axios from 'axios';

// return a promise for when data is received
export default function(url) {
  return (
    axios.get(url)
      .then(function (response){
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
  );
}

