const React = require('react');
const ReactDOM = require('react-dom');
const D3Component = require('../../..');
const d3 = require('d3');

class Force extends D3Component {

  initialize(node, props) {
    const canvas = d3.select(node).append('canvas').node();
    const context = canvas.getContext("2d");
    const width = node.getBoundingClientRect().width;
    const height = width * 0.9;
    canvas.width = width;
    canvas.height = height;

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var self = this;
    d3.json("https://rawgit.com/mbostock/ad70335eeef6d167bc36fd3c04378048/raw/df541a01e850c6073ece4516fcd74ea1bae080ab/miserables.json", function(error, graph) {
      if (error) throw error;

      simulation
          .nodes(graph.nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(graph.links);

      d3.select(canvas)
          .call(d3.drag()
              .container(canvas)
              .subject(dragsubject)
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

      function ticked() {
        context.clearRect(0, 0, width, height);

        context.beginPath();
        graph.links.forEach(drawLink);
        context.strokeStyle = "#aaa";
        context.stroke();

        context.beginPath();
        graph.nodes.forEach(drawNode);
        context.fillStyle = (self._props || self.props).nodeColor;
        context.fill();
        context.strokeStyle = "#fff";
        context.stroke();
      }

      function dragsubject() {
        return simulation.find(d3.event.x, d3.event.y);
      }


      self.tick = ticked;
    });

    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }

    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }

  }

  update(props) {
    this._props = props;
    this.tick();
  }
}

Force.defaultProps = {
  nodeColor: '#000'
};

module.exports = Force;
