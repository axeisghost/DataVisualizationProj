var pageWidth = $(window).width();
var diameter = 600;
var radius = diameter / 2;
var nodeR = 6;
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
var selectedHeroes = [];
var selectedOne = false;
// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("name");
    var angle = circle.attr("angle");
    var tooltip = d3.select("#plot")
    .append("text")
    .attr("dy", ".35em")
    .attr("id", "tooltip" + circle.attr("id"))
    .attr("class", "tooltip unhovered")
    .attr("anchored", "false")
    .attr("text-anchor", function(d) { return angle > Math.PI ? "end" : null; })
    .attr("transform", function(d) {
      return "rotate(" + (90 - angle * 180 / Math.PI) + ")" +
        "translate(" + (radius-10) + ")" +
        (angle > Math.PI ? "rotate(180)" : "");
    })
    .text(text)
    .style("cursor", "pointer");
}

// Draws an arc diagram for the provided undirected graph
function drawGraph(graph) {
    // create svg image
    var svg  = d3.select("body").select("#circle")
        .append("svg")
        .attr("width", diameter + 200)
        .attr("height", diameter + 120)
        .attr("align", "center")
        .attr("id", "plotingCanvas");

    // draw border around svg image
    // svg.append("rect")
    //     .attr("class", "outline")
    //     .attr("width", diameter)
    //     .attr("height", diameter);

    // create plot area within svg image
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + (radius + 100) + ", " + (radius + 60) + ")");

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
        d.angle = theta;
    });
    nodesDataRef = nodes;
}

// Draws nodes with tooltips
function drawNodes(nodes) {
    // used to assign nodes color by group

    nodesRef = d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d, i) { return "nodeNo" + d.idx; })
        .attr("name", function(d, i) {return d.name})
        .attr("angle", function(d, i) {return d.angle})
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r", function(d) {return d.r;})
        .attr("clicked", "false")
        .style("fill", "rgb(31,119,180)")
        .on("mouseover", function(d, i) {
          nodesRef.style("opacity", 0.3);
          linksRef.style("opacity", function(d) {
            return d3.select(this).style("opacity") * 0.3;
          });
          d.adjacentNodes.forEach(function(each) {
            d3.select("#" + "nodeNo" + each)
                       .style("opacity", 1);
            d3.select("#" + "tooltip" + "nodeNo" + each).attr("class", "tooltip hovered");
          });
          d.adjacentEdges.forEach(function(each) {
            d3.select("#" + each).style("opacity", 1).style("stroke", "red");
          });
          d3.select(this).style("opacity", 1);
          d3.select("#plot").select("#" + "tooltip" + "nodeNo" + i)
          .attr("class", "tooltip hovered");
        })
        .on("mouseout",  function(d, i) {
          linksRef.style("opacity", function(e) {
            if (d3.select(this).style("opacity") != 0) {
              return 1;
            }
            return 0;
          });
          nodesRef
          .style("opacity", 1);
          d3.selectAll(".tooltip.hovered").attr("class", function(f) {
            if (d3.select(this).attr("anchored") == "true") {
              return "tooltip anchored";
            } else {
              return "tooltip unhovered";
            }
          });
          d3.selectAll(".link.unselected").style("stroke", "#888888");
        })
        .on("click", function(d, i) {
          var tempRef = d3.select(this);
          if (tempRef.attr("clicked") == "false") {
            tempRef.attr("clicked", "true");
            tempRef.style("fill", "red");
            d3.selectAll(".tooltip.hovered").attr("class", "tooltip anchored")
                                            .attr("anchored", "true");
            linksRef.attr("class", function(f) {
              if (f.source == d || f.target == d) {
                return "link selected";
              } else {
                return "link unselected";
              }
            })
            selectedHeroes.push({name: d.name, id: d.idx});
            selectedOne = true;
          } else {
            tempRef.attr("clicked", "false");
            tempRef.style("fill", "rgb(31,119,180)");
            d3.selectAll(".tooltip").attr("class", "tooltip unhovered").attr("anchored", "false");
            linksRef.attr("class", function(f) {
              if (f.source == d || f.target == d) {
                return "link unselected";
              } else {
                return d3.select(this).attr("class");
              }
            })
            selectedHeroes.length = 0;
            selectedOne = false;
          }
          if (selectedHeroes.length == 2) {
            selectedHeroes.forEach(function(each) {
              d3.select("#" + "nodeNo" + each.id).style("fill", "rgb(31,119,180)")
              .attr("clicked","false");
            });
            linksRef.attr("class", "link unselected");
            d3.selectAll(".tooltip").attr("class", "tooltip unhovered").attr("anchored", "false");
            console.log(selectedHeroes);
            selectedHeroes.length = 0;
          }
        });
        nodesRef.each(function(d, i) {
          addTooltip(d3.select("#" + "nodeNo" + i));
        });
}

function drawLinks(links) {
    linksRef = d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link unselected")
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
    // d3.select(".tooltip.anchored").attr("class", function(d) {
    //   if 
    // })
    return 1;
  });
  d3.selectAll(".tooltip").attr("class", "tooltip unhovered").attr("anchored", "false");
  selectedHeroes.forEach(function(each) {
    d3.select("#" + "nodeNo" + each.id)
    .each(function(d) {
      d.adjacentNodes.forEach(function(adj) {
        d3.select("#" + "tooltip" + "nodeNo" + adj).attr("class", "tooltip anchored").attr("anchored", "true");
      })
    })
    d3.select("#" + "tooltipnodeNo" + each.id).attr("class", "tooltip anchored").attr("anchored", "true");
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
    .attr("id", function(d) {return edgeKey(d);})
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