(function() {
  d3.fisheye = function() {
    var radius = 300,
      power = 2,
      k0,
      k1,
      center = [0, 0];

    function fisheye(d) {
      var dx = d.x - center[0],
        dy = d.y - center[1],
        dd = Math.sqrt(dx * dx + dy * dy);
      if (dd >= radius) return { x: d.x, y: d.y, z: 1 };
      var k = ((k0 * (1 - Math.exp(-dd * k1))) / dd) * 0.75 + 0.25;
      return { x: center[0] + dx * k, y: center[1] + dy * k, z: Math.min(k, 10) };
    }

    function rescale() {
      k0 = Math.exp(power);
      k0 = (k0 / (k0 - 1)) * radius;
      k1 = power / radius;
      return fisheye;
    }

    fisheye.radius = function(_) {
      if (!arguments.length) return radius;
      radius = +_;
      return rescale();
    };

    fisheye.power = function(_) {
      if (!arguments.length) return power;
      power = +_;
      return rescale();
    };

    fisheye.center = function(_) {
      if (!arguments.length) return center;
      center = _;
      return fisheye;
    };

    return rescale();
  };
})();

nv.models.fisheyeGraph = function() {
  'use strict';

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------
  var margin = { top: 2, right: 0, bottom: 2, left: 0 },
    width = 400,
    height = 32,
    svg = null,
    container = null,
    dispatch = d3.dispatch('renderEnd', 'elementClick', 'elementDblClick'),
    color = nv.utils.getColor(['#000']),
    tooltip = nv.models.tooltip(),
    noData = null,
    // Force directed graph specific parameters [default values]
    linkStrength = 0.1,
    friction = 0.9,
    linkDist = 30,
    charge = -180,
    gravity = 0.06,
    theta = 0.8,
    alpha = 0.1,
    radius = 5,
    fisheyeRadius = 100,
    // These functions allow to add extra attributes to ndes and links
    nodeExtras = function(nodes) {
      /* Do nothing */
    },
    linkExtras = function(links) {
      /* Do nothing */
    };
  var fisheye = d3
    .fisheye()
    .radius(fisheyeRadius)
    .power(2);
  //============================================================
  // Private Variables
  //------------------------------------------------------------

  var renderWatch = nv.utils.renderWatch(dispatch);

  function chart(selection) {
    renderWatch.reset();

    selection.each(function(data) {
      svg = d3.select(this);
      nv.utils.initSVG(svg);

      var availableWidth = nv.utils.availableWidth(width, svg, margin),
        availableHeight = nv.utils.availableHeight(height, svg, margin);

      container = svg
        .attr('width', availableWidth)
        .attr('height', availableHeight)
        .call(d3.behavior.zoom().on('zoom', zoom))
        //.attr("pointer-events", "all")
        .append('svg:g');

      //.append('svg:g');

      // Display No Data message if there's nothing to show.
      if (!data || !data.links || !data.nodes) {
        nv.utils.noData(chart, container);
        return chart;
      } else {
        container.selectAll('.nv-noData').remove();
      }
      container.selectAll('*').remove();
      container
        .append('svg:rect')
        .attr('x', -availableWidth)
        .attr('y', -availableHeight)
        .attr('width', 3 * availableWidth)
        .attr('height', 3 * availableHeight)
        .attr('fill-opacity', 0);

      // Collect names of all fields in the nodes
      /*var nodeFieldSet = new Set();
          data.nodes.forEach(function(node) {
            var keys = Object.keys(node);
            keys.forEach(function(key) {
              nodeFieldSet.add(key);
            });
          });*/
      var nodeFieldSet = ['name'];

      var force = d3.layout
        .force()
        .nodes(data.nodes)
        .links(data.links)
        .size([availableWidth, availableHeight])
        .linkStrength(linkStrength)
        .friction(friction)
        .linkDistance(linkDist)
        .charge(charge)
        .gravity(gravity)
        .theta(theta)
        .alpha(alpha)
        .start();

      var linkedByIndex = {};
      data.links.forEach(function(d) {
        linkedByIndex[d.source.index + ',' + d.target.index] = 1;
      });
      // console.log("Linked by Index: ",linkedByIndex);
      function isConnected(a, b) {
        return linkedByIndex[a.index + ',' + b.index] || linkedByIndex[b.index + ',' + a.index] || a.index == b.index;
      }
      function isMainNode(a, b) {
        return a === b;
      }

      var link = container
        .selectAll('.link')
        .data(data.links)
        .enter()
        .append('line')
        .attr('class', 'nv-force-link')
        .style('stroke-width', function(d) {
          return Math.sqrt(d.value);
        });

      var node = container
        .selectAll('.node')
        .data(data.nodes)
        .enter()
        .append('g')
        .attr('class', 'nv-force-node')
        .call(force.drag)
        .on('mousedown', function(d) {
          d3.event.stopPropagation();
        });

      node
        .append('circle')
        .attr('r', radius)
        // .style("fill", function(d) { return color(d) } )
        .on('mouseover', function(evt) {
          node
            .classed('highlight', function(o) {
              return isConnected(evt, o);
            })
            .classed('highlight-mainNode', function(o) {
              return isMainNode(evt, o);
            });
          link.classed('highlight', function(o) {
            return o.source.index == evt.index || o.target.index == evt.index;
          });
          container.select('.nv-series-' + evt.seriesIndex + ' .nv-distx-' + evt.pointIndex).attr('y1', evt.py);
          container.select('.nv-series-' + evt.seriesIndex + ' .nv-disty-' + evt.pointIndex).attr('x2', evt.px);

          // Add 'series' object to
          var nodeColor = color(evt);
          evt.series = [];
          nodeFieldSet.forEach(function(field) {
            evt.series.push({
              color: nodeColor,
              key: field,
              value: evt[field]
            });
          });
          //tooltip.data(evt).hidden(false);
        })
        .on('mouseout', function(d) {
          tooltip.hidden(true);
          node.classed('highlight', false).classed('highlight-mainNode', false);
          link.classed('highlight', false);
        })
        .on('click', function(evt) {
          node
            .classed('selected', function(o) {
              return isConnected(evt, o);
            })
            .classed('selected-mainNode', function(o) {
              return isMainNode(evt, o);
            })
            .classed('', function(o) {
              return !isConnected(evt, o) || !isMainNode(evt, o);
            });
          link
            .classed('selected', function(o) {
              return o.source.index == evt.index || o.target.index == evt.index;
            })
            .classed('', function(o) {
              return !(o.source.index == evt.index || o.target.index == evt.index);
            });
          dispatch.elementClick(evt);
        })
        .on('dblclick', function(evt) {
          tooltip.hidden(true);
          dispatch.elementDblClick(evt);
        });

      function zoom() {
        var trans = d3.event.translate;
        var scale = d3.event.scale;
        fisheye.radius(fisheyeRadius / scale);
        container.attr('transform', 'translate(' + trans + ')' + ' scale(' + scale + ')');
        if (scale < 1) scale = 1;
        node.select('circle').attr('transform', 'scale(' + 1.0 / Math.sqrt(scale) + ')');
        node.select('text').attr('transform', 'scale(' + 1.0 / scale + ')');
        link.style('stroke-width', function(d) {
          return Math.sqrt((d.value * 1.0) / scale);
        });
      }

      tooltip.headerFormatter(function(d) {
        return 'Metric';
      });

      // Apply extra attributes to nodes and links (if any)
      linkExtras(link);
      nodeExtras(node);

      force.on('tick', function() {
        updateFisheye();
      });

      function updateFisheye() {
        node
          .each(function(d) {
            d.display = fisheye(d);
          })
          .attr('transform', function(d) {
            return 'translate(' + d.display.x + ', ' + d.display.y + ')';
            // +  " scale(" + d.display.z + ")";
          });

        link
          .attr('x1', function(d) {
            return d.source.display.x;
          })
          .attr('y1', function(d) {
            return d.source.display.y;
          })
          .attr('x2', function(d) {
            return d.target.display.x;
          })
          .attr('y2', function(d) {
            return d.target.display.y;
          });
      }
      /*container.on("mousemove", function () {
            fisheye.center(d3.mouse(this));
            updateFisheye();
          });*/
    });

    return chart;
  }

  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  chart.options = nv.utils.optionsFunc.bind(chart);

  chart._options = Object.create(
    {},
    {
      // simple options, just get/set the necessary values
      width: {
        get: function() {
          return width;
        },
        set: function(_) {
          width = _;
        }
      },
      height: {
        get: function() {
          return height;
        },
        set: function(_) {
          height = _;
        }
      },

      // Force directed graph specific parameters
      linkStrength: {
        get: function() {
          return linkStrength;
        },
        set: function(_) {
          linkStrength = _;
        }
      },
      friction: {
        get: function() {
          return friction;
        },
        set: function(_) {
          friction = _;
        }
      },
      linkDist: {
        get: function() {
          return linkDist;
        },
        set: function(_) {
          linkDist = _;
        }
      },
      charge: {
        get: function() {
          return charge;
        },
        set: function(_) {
          charge = _;
        }
      },
      gravity: {
        get: function() {
          return gravity;
        },
        set: function(_) {
          gravity = _;
        }
      },
      theta: {
        get: function() {
          return theta;
        },
        set: function(_) {
          theta = _;
        }
      },
      alpha: {
        get: function() {
          return alpha;
        },
        set: function(_) {
          alpha = _;
        }
      },
      radius: {
        get: function() {
          return radius;
        },
        set: function(_) {
          radius = _;
        }
      },

      //functor options
      x: {
        get: function() {
          return getX;
        },
        set: function(_) {
          getX = d3.functor(_);
        }
      },
      y: {
        get: function() {
          return getY;
        },
        set: function(_) {
          getY = d3.functor(_);
        }
      },

      // options that require extra logic in the setter
      margin: {
        get: function() {
          return margin;
        },
        set: function(_) {
          margin.top = _.top !== undefined ? _.top : margin.top;
          margin.right = _.right !== undefined ? _.right : margin.right;
          margin.bottom = _.bottom !== undefined ? _.bottom : margin.bottom;
          margin.left = _.left !== undefined ? _.left : margin.left;
        }
      },
      color: {
        get: function() {
          return color;
        },
        set: function(_) {
          color = nv.utils.getColor(_);
        }
      },
      noData: {
        get: function() {
          return noData;
        },
        set: function(_) {
          noData = _;
        }
      },
      nodeExtras: {
        get: function() {
          return nodeExtras;
        },
        set: function(_) {
          nodeExtras = _;
        }
      },
      linkExtras: {
        get: function() {
          return linkExtras;
        },
        set: function(_) {
          linkExtras = _;
        }
      }
    }
  );

  chart.dispatch = dispatch;
  chart.tooltip = tooltip;
  nv.utils.initOptions(chart);
  return chart;
};
