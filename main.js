var pageWidth = $(window).width();
var diameter = 700;
var radius = diameter / 2;
var nodeR = 7;
var margin = 20;
var initLowWin = 55;
var initHighWin = 60;
var initLowFreq = 30;
var initHighFreq = 50;
var nodesRef;
var linksRef;
var nodesDataRef;
var fisheye = d3.fisheye.circular()
    .radius(50)
    .distortion(4);
// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("name");

    var tooltip = d3.select("#plot")
        .append("text")
        .text(text)
        .attr("x", x)
        .attr("y", y)
        .attr("dy", -r * 2)
        .attr("id", "tooltip");

    var offset = tooltip.node().getBBox().width / 2;

    if ((x - offset) < -radius) {
        tooltip.attr("text-anchor", "start");
        tooltip.attr("dx", -r);
    }
    else if ((x + offset) > (radius)) {
        tooltip.attr("text-anchor", "end");
        tooltip.attr("dx", r);
    }
    else {
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }
}

// Draws an arc diagram for the provided undirected graph
function drawGraph(graph) {
    // create svg image
    var svg  = d3.select("body").select("#circle")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("aligh", "center");

    // draw border around svg image
    // svg.append("rect")
    //     .attr("class", "outline")
    //     .attr("width", diameter)
    //     .attr("height", diameter);

    // create plot area within svg image
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + radius + ", " + radius + ")");

    // draw border around plot area
    // plot.append("circle")
    //     .attr("class", "outline")
    //     .attr("r", radius - margin);

    // fix graph links to map to objects instead of indices
    graph.links.forEach(function(d, i) {
        d.source = isNaN(d.source) ? d.source : graph.nodes[d.source];
        d.target = isNaN(d.target) ? d.target : graph.nodes[d.target];
    });

    // calculate node positions
    circleLayout(graph.nodes);

    // draw edges first
    drawLinks(graph.links);
    // drawCurves(graph.links);

    // draw nodes last
    drawNodes(graph.nodes);
    filterChanged();
    setTextForWinRate();
    setTextForFrequency();
    // plot.on("mouseover", function(){
    //   fisheye.focus(d3.mouse(this));
    //   fisheye.radius(50);
    //   nodesRef.each(function(d) {d.fisheye = fisheye(d)})
    //        .attr("cx", function(d) { return d.fisheye.x; })
    //        .attr("cy", function(d) { return d.fisheye.y; })
    //        .attr("r", function(d) { return d.fisheye.z * 4.5; });
    //   linksRef.attr("x1", function(d) { return d.source.fisheye.x; })
    //           .attr("y1", function(d) { return d.source.fisheye.y; })
    //           .attr("x2", function(d) { return d.target.fisheye.x; })
    //           .attr("y2", function(d) { return d.target.fisheye.y; });
    // });
}

// Calculates node locations
function circleLayout(nodes) {
    // sort nodes by group
    nodes.sort(function(a, b) {
        return a.group - b.group;
    });

    // use to scale node index to theta value
    var scale = d3.scale.linear()
        .domain([0, nodes.length])
        .range([0, 2 * Math.PI]);

    // calculate theta for each node
    nodes.forEach(function(d, i) {
        // calculate polar coordinates
        var theta  = scale(i);
        var radial = radius - margin;

        // convert to cartesian coordinates
        d.idx = i;
        d.x = radial * Math.sin(theta);
        d.y = radial * Math.cos(theta);
        d.adjacentEdges = [];
        d.adjacentNodes = [];
        d.r = nodeR;
    });
    nodesDataRef = nodes;
}

// Draws nodes with tooltips
function drawNodes(nodes) {
    // used to assign nodes color by group
    var color = d3.scale.category20();

    nodesRef = d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d, i) { return "nodeNo" + d.idx; })
        .attr("name", function(d, i) {return d.name})
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r", function(d) {return d.r;})
        .style("fill",   function(d, i) { return color(d.group); })
        .on("mouseover", function(d, i) {
          nodesRef.style("opacity", 0.3);
          linksRef.style("opacity", function(d) {
            return d3.select(this).style("opacity") * 0.3;
          });
          d.adjacentNodes.forEach(function(each) {
            addTooltip(d3.select("#" + "nodeNo" + each)
                       .style("opacity", 1));
          });
          d.adjacentEdges.forEach(function(each) {
            d3.select("#" + each).style("opacity", 1).style("stroke", "red");
          })
          // linksRef
          // .style("opacity", function(e) {
          //   if (d3.select(this).style("opacity") != 0) {
          //     if (!(e.source == d || e.target == d)) {
          //       return 0.3;
          //     } else {
          //       nodesRef
          //       .style("fill", function(f) {
          //         if (e.source == f || e.target == f) {
          //           if (f != d) {
          //             addTooltip(d3.select(this));
          //           }
          //           return "red";
          //         }
          //         return d3.select(this).style("fill");
          //       })
          //       .style("opacity", function(f) {
          //         if (e.source != f && e.target != f) {
          //           return 0.3;
          //         }
          //         return d3.select(this).style("fill");
          //       })
          //       return 1;
          //     }
          //   }
          //   return 0;
          // });
          
          addTooltip(d3.select("#" + "nodeNo" + i).style("opacity", 1));
        })
        .on("mouseout",  function(d, i) { 
          d3.selectAll("#tooltip").remove(); 
          linksRef.style("opacity", function(e) {
            if (d3.select(this).style("opacity") != 0) {
              return 1;
            }
            return 0;
          })
          .style("stroke", "#888888");
          nodesRef.style("fill", function(e) {
            return "rgb(31,119,180)"
          })
          .style("opacity", 1);
        });
}

// Draws straight edges between nodes
function drawLinks(links) {
    linksRef = d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("id", function(d) {return edgeKey(d);})
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .style("stroke-width", function(d) {
          if (d['win_rate'] > 65) {
            return "3px";
          } else if (d['win_rate'] > 55) {
            return "2px";
          }
          return "1px";
        });
}

function filterChanged() {
  var lowWin = $("#winRateSlider").slider("values", 0);
  var highWin = $("#winRateSlider").slider("values", 1);
  var lowFreq = $("#frequencySlider").slider("values", 0) / 100;
  var highFreq = $("#frequencySlider").slider("values", 1) / 100;
  var disableFilterWinRate = $("#activateWinRateFilter").prop("checked");
  var disableFilterFrequency = $("#activateFrequencyFilter").prop("checked");
  // d3.select("#plot").selectAll(".link")
  nodesDataRef.forEach(function(d) {
    d.adjacentEdges = [];
    d.adjacentNodes = [];
  });
  linksRef
  .style("opacity", function(d) {
    if (!disableFilterWinRate) {
      if (d['win_rate'] < lowWin || d['win_rate'] > highWin) {
        return 0;
      }
    }
    if (!disableFilterFrequency) {
      if (d['frequency'] < lowFreq || d['frequency'] > highFreq) {
        return 0;
      }
    }
    
    d.source.adjacentEdges.push(edgeKey(d));
    d.target.adjacentEdges.push(edgeKey(d));
    d.source.adjacentNodes.push(d.target.idx);
    d.target.adjacentNodes.push(d.source.idx);
    return 1;
  });
}

function edgeKey(d) {
  return "a" + Math.min(d.target.idx, d.source.idx) + "b" + Math.max(d.target.idx, d.source.idx);
}

// Draws curved edges between nodes
function drawCurves(links) {
    // remember this from tree example?
    var curve = d3.svg.diagonal()
        .projection(function(d) { return [d.x, d.y]; });

    linksRef = d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", curve);
}

function setTextForWinRate() {
  $("#winRateText").text("Win rate range: "
                          + $( "#winRateSlider" ).slider("values", 0) + "% - "
                          + $( "#winRateSlider" ).slider("values", 1) + "%");
}

function setTextForFrequency() {
  $("#frequencyText").text("Frequency range: "
                        + $( "#frequencySlider" ).slider("values", 0) / 100 + "% - "
                        + $( "#frequencySlider" ).slider("values", 1) / 100 + "%");
}


$(function() {
  $( "#winRateSlider" ).slider(
    {
      range: true,
      min: 50,
      max: 80,
      values: [initLowWin, initHighWin],
      width: "50%",
      slide: function(e, ui) {
        filterChanged();
        setTextForWinRate();
      }
    }
  );
  $( "#frequencySlider" ).slider(
    {
      range: true,
      min: 10,
      max: 70,
      values: [initLowFreq, initHighFreq],
      width: "50%",
      slide: function(e, ui) {
        filterChanged();
        setTextForFrequency();
      }
    }
  );
});