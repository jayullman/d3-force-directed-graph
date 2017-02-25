// this module will be responsible for rendering the graph to the page

/* Reference links:
   adapted from:
    https://bl.ocks.org/mbostock/4062045

  bounded graph:
    https://bl.ocks.org/mbostock/1129492
 */
import '../styles/graph.css';
// css for flag sprites
import '../styles/flags.min.css';
import getSvgWidth from './getSvgWidth';
import * as d3 from 'd3';
import { svgWidthPercent } from '../constants';

const minSvgWidth = 310;

const mouseOverHandler = (d) => {

  // use to center tooltip dynamically based length of the country name
  const letterLength = d.country.length * 8;

  d3.select('.tooltip')
    .attr('style', 'left: ' + (d3.event.pageX - (letterLength / 2)) +
      'px; top:  ' + (d3.event.pageY - 60) + 'px;')
    .classed('show-tooltip', true);
  
  // tooltip info goes here
  d3.select('.tooltip-info')
    .html(
      d.country
    );
};

export default (json) => {
  const width = getSvgWidth(svgWidthPercent, minSvgWidth);
  const height = 600;
  // provides distance around node used to calculate colision with svg container
  const circleRadius = 5;
  
  const graphContainer = d3.select('.graph');
  const svg = graphContainer
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const simulation = d3.forceSimulation()
    .nodes(json.nodes);

  simulation
    .force('link', d3.forceLink().distance(50))
    .force('charge', d3.forceManyBody().distanceMax(120).distanceMin(30))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("collide",d3.forceCollide(15));
  
  const link = svg
    .selectAll('line')
    .data(json.links)
    .enter()
      .append('line')
      .attr('class', 'line');

    const dragstarted = (d) => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  const dragended = (d) => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  const clampTop = (x) =>  Math.max(0, Math.min(height,x));
	
	const clampLeft = (y) =>  Math.max(0, Math.min(width,y));

  const ticked = () => {
    node
      // the returned value will keep the nodes within bounds of the svg element
      .style('left', d => `${(Math.max(circleRadius, Math.min(width - circleRadius, d.x))) - 8}px` )
			.style('top', d =>  `${(Math.max(circleRadius, Math.min(height - circleRadius, d.y))) - 8}px` );

    link
        .attr('x1', d => `${Math.max(circleRadius, Math.min(width, d.source.x))}`)
        .attr('y1', d => `${Math.max(circleRadius, Math.min(height, d.source.y))}`)
        .attr('x2', d => `${Math.max(circleRadius, Math.min(width, d.target.x))}`)
        .attr('y2', d => `${Math.max(circleRadius, Math.min(height, d.target.y))}`);
  };

  const node = d3.select('.graph').append('div')
    .classed('flag-container', true)
    .selectAll('div')
    .data(json.nodes)
    .enter()
      .append('div')
      .attr('class', d => {
        return 'flag flag-' + d.code;
      })
      .on('mouseover', mouseOverHandler)
      .on('mousemove', mouseOverHandler)
      .on('mouseleave', () => { d3.select('.tooltip').classed('show-tooltip', false); })
      .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

  simulation.force('link')
    .links(json.links);

  simulation
    .on('tick', ticked);
};




