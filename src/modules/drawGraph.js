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

const minSvgWidth = 310;


export default function(json) {
  // const width = getSvgWidth(0.9, minSvgWidth);
  const width = 800;
  const height = 800;
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
    .force('charge', d3.forceManyBody().distanceMax(80).distanceMin(20))
    .force('center', d3.forceCenter(width / 2, height / 2));
  
  const link = svg
    .selectAll('line')
    .data(json.links)
    .enter()
      .append('line')
      .attr('stroke', '#777')
      .attr('stroke-width', 2);

  const node = d3.select('.graph').append('div')
    .selectAll('div')
    .data(json.nodes)
    .enter()
      .append('div')
      .attr('class', d => {
        return 'flag flag-' + d.code;
      })
      .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

  // node.append('title')
  //     .text(function(d) { return d.country; });

  

  simulation.force('link')
    .links(json.links);

  simulation
    .on('tick', ticked);

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

  function ticked() {
    node
      .style('left', d => `${d.x}px` )
			.style('top', d =>  `${d.y}px` );

    link
        .attr('x1', d => d.source.x )
        .attr('y1', d => d.source.y )
        .attr('x2', d => d.target.x )
        .attr('y2', d => d.target.y );

        // the returned value will keep the nodes within bounds of the svg element


     
        // .style('left', d => {
        //  return Math.max(circleRadius, Math.min(width - circleRadius, d.x)) + 'px'
        // })
        // .style('top', d => {
        //   return Math.max(circleRadius, Math.min(height - circleRadius, d.y)) + 'px'
        // })
  }
}




