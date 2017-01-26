// Inspiration taken heavily from http://bl.ocks.org/mbostock/7882658

function listener () {
    console.log("Recieved githubAPI response");
    localStorage.setItem("githubAPI_response", this.response);
    displayd3();
}

function displayd3 () {
    // get github stuff out of local storage
    var githubStuff = JSON.parse(localStorage.getItem("githubAPI_response"));
    var numberOfNodes = githubStuff.length
    // console.log(githubStuff);
    // console.log(numberOfNodes);

    // width of svg
    var width = 800,
        // height of svg element
        height = 500,
        // distance between same-color nodes
        padding = 1.5,
        // distance between different-color nodes
        clusterPadding = 6,
        // radius of circle?
        maxRadius = 12;
    
    // label the languages with a numerical ID to sort by
    var languageIndex = {}, clusterNum = 0;
    for (i = 0; i < numberOfNodes; i++) {
        if (!(languageIndex.hasOwnProperty(githubStuff[i]["language"]))) {
            languageIndex[githubStuff[i]["language"]] = clusterNum;
            clusterNum++;
        }
    }

    // create nodes
    var nodes = new Array(numberOfNodes);
    for (i = 0; i < numberOfNodes; i++) {
        nodes[i] = {
            "size": githubStuff[i]["size"],
            "language": languageIndex[githubStuff[i]["language"]],
            "name": githubStuff[i]["name"]
        }
    }
    console.log(nodes);
    // create color scale
    var colors = d3.schemeCategory20;

    // use packing layout
    // d3.pack(nodes);

    // create a force simulation
    var forceSim = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(chargeStrength))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(collideRadius).strength(1))
        .alphaDecay(0);
    // Set the charge strength
    function chargeStrength(d) {
        return d.size/500;
    }
    // set the collision radius
    function collideRadius(d) {
        return 5*Math.log(d.size);
    }

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
    function dragstarted(d) {
        if (!d3.event.active) forceSim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function dragended(d) {
        if (!d3.event.active) forceSim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    node.append("circle")
        .style("fill", function(d) { return colors[d.language]; })
        .attr("r", function(d) { return 5*Math.log(d.size) } )

    node.append("text")
        .attr("dx", function(d) { return 0 })
        .attr("dy", function(d) { return 0 })
        .text(function(d) { return d.name } );
    console.log(node);

    forceSim.on("tick", 
        function tick(e) {
          node
            // .each(cluster(10 * e.alpha * e.alpha))
            // .each(collide(.5))
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        }
    );

    // node.transition()
        // .duration(750)
        // .delay(function(d, i) { return i * 5; })
        // .attrTween("r", function(d) {
          // var i = d3.interpolate(0, d.radius);
          // return function(t) { return d.radius = i(t); };
        // });

    // Move d to be adjacent to the cluster node.
    // function cluster(alpha) {
      // return function(d) {
        // var cluster = clusters[d.cluster];
        // if (cluster === d) return;
        // var x = d.x - cluster.x,
            // y = d.y - cluster.y,
            // l = Math.sqrt(x * x + y * y),
            // r = d.radius + cluster.radius;
        // if (l != r) {
          // l = (l - r) / l * alpha;
          // d.x -= x *= l;
          // d.y -= y *= l;
          // cluster.x += x;
          // cluster.y += y;
        // }
      // };
    // }

// Resolves collisions between d and all other circles.
    // function collide(alpha) {
      // var quadtree = d3.geom.quadtree(nodes);
      // return function(d) {
        // var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
            // nx1 = d.x - r,
            // nx2 = d.x + r,
            // ny1 = d.y - r,
            // ny2 = d.y + r;
        // quadtree.visit(function(quad, x1, y1, x2, y2) {
          // if (quad.point && (quad.point !== d)) {
            // var x = d.x - quad.point.x,
                // y = d.y - quad.point.y,
                // l = Math.sqrt(x * x + y * y),
                // r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
            // if (l < r) {
                // l = (l - r) / l * alpha;
                // d.x -= x *= l;
                // d.y -= y *= l;
                // quad.point.x += x;
                // quad.point.y += y;
            // }
          // }
          // return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        // });
      // };
    // }
}

// Set the base URL for now
var baseURL = "https://api.github.com/users/ztaira14/repos";

// Construct XMLHttpRequest and send it, store the result in localstorage
var githubAPI = new XMLHttpRequest();
githubAPI.open("GET", baseURL);
githubAPI.addEventListener("load", listener);
githubAPI.send();

console.log("Sent githubAPI request")

