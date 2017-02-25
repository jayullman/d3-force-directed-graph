

import * as d3 from "d3";
import debounce from 'lodash.debounce';
import getJson from './modules/getJson';
import drawGraph from './modules/drawGraph';
import getSvgWidth from './modules/getSvgWidth';
import { svgWidthPercent } from './constants';

// import main page styles
import './styles/styles.css';

// url from which to receive json data
const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
const minSvgWidth = 310;
var dataset = [];

// dataset is a promise for the requested json dataset
let promisedData = getJson(url);

const resolvePromise = () => {
  promisedData
  .then((dataset) => {
    drawGraph(dataset);
  })
  .catch(error => console.log(error));
};

resolvePromise();

// create tooltip and append to body, add event listeners for window resizing
window.onload = function() {
  var testing;
  // create tooltip
  var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip');

  // labels within tooltip that will display the name of the country
  tooltip.append('div')
    .attr('class', 'tooltip-info');

  // create debounced function that will resize the svg upon
  // window resizing using lodash's debounce method
  const deboucedResizeGraph = debounce(
    () => {
    const svgWidth = getSvgWidth(svgWidthPercent, minSvgWidth);
    // remove old chart and legend box on resizing
    d3.select('svg').remove();
    d3.select('.flag-container').remove();
    resolvePromise();
    },
    250
  );

  window.addEventListener('resize', function(event) {
    deboucedResizeGraph();
  });
};   