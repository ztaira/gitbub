// Made in d3 v4
// Inspiration taken heavily from:
// Cluster Force Layout
// http://bl.ocks.org/mbostock/7882658
// Github visualizer in d3
// http://ghv.artzub.com/#user=ztaira14
// Graph with tooltips
// https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73

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
            languageIndex[clusterNum] = githubStuff[i]["language"];
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
        .force("collide", d3.forceCollide(collideRadius).strength(1).iterations(3))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alphaDecay(0);
    // Set the charge strength
    function chargeStrength(d) {
        return d.size/500;
    }
    // set the collision radius
    function collideRadius(d) {
        return 12+5*Math.log(d.size);
    }

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .html("Hello World");

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .style("fill", function(d) { return colors[d.language]; })
        .attr("r", function(d) { return 12+5*Math.log(d.size) } )
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
        .on("mouseenter", function (d) {
          div.transition()
              .duration(200)
              .style("opacity", .8);
          div.html("Name: " + d.name + "<br>Size: " + d.size + "<br>Language: " + languageIndex[d.language])
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
        .on("mouseleave", function (d) {
          div.transition()
              .duration(500)
              .style("opacity", 0);
        })
        .on("click", function (d) {
            ztairaGithub = "https://github.com/ztaira14/";
            d3.event.stopPropagation();
            window.open(ztairaGithub + d.name);
        });
    console.log(node);
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

    forceSim.on("tick", 
        function tick(e) {
          node
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        }
    );
}

// Set the base URL for now
var baseURL = "https://api.github.com/users/ztaira14/repos";

// Construct XMLHttpRequest and send it, store the result in localstorage
var githubAPI = new XMLHttpRequest();
githubAPI.open("GET", baseURL);
githubAPI.addEventListener("load", listener);
githubAPI.send();

console.log("Sent githubAPI request")

