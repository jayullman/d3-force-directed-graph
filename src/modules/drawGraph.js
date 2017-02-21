// this module will be responsible for rendering the graph to the page

/* Reference links:
   simplest graph:
   http://bl.ocks.org/sathomas/11550728
   
   building full graph:
   https://bl.ocks.org/mbostock/4062045
 */

import getSvgWidth from './getSvgWidth';

const minSvgWidth = 310;

export default function(dataset) {
  const svgWidth = getSvgWidth(minSvgWidth);
  const svgHeight = 440;

  console.log(dataset);
}