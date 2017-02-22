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
import * as d3 from "d3";

const minSvgWidth = 310;

export default function(dataset) {
  const width = getSvgWidth(0.9, minSvgWidth);
  const height = 800;
  const circleRadius = 5;
  const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id((d, i) => i))
    .force("charge", d3.forceManyBody().strength(-5))
    .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
      .append("line")
      .attr("stroke-width", 2);

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("img")
    .data(graph.nodes)
    .enter()
      .append("img")
      .attr("class", d => {
        return 'flag flag-' + d.code;
      })
      .attr("fill", 'yellow')
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.country; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        // the returned value will keep the nodes within bounds of the svg element
    node
        .attr("cx", d => Math.max(circleRadius, Math.min(width - circleRadius, d.x)) )
        .attr("cy", d => Math.max(circleRadius, Math.min(height - circleRadius, d.y)) );
  }
});

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

  console.log(dataset);
}
