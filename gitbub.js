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

    // width of svg
    var width = 960,
        // height of svg element
        height = 600;
    
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

    // create the tooltip text
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .html("Hello World");

    // create the svg
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // create the nodes in the svg
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        // the color of each node
        .style("fill", function(d) { return colors[d.language]; })
        // the size of each node
        .attr("r", function(d) { return 12+5*Math.log(d.size) } )
        // functions to call when dragged
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
        // show the tooltip on mouseover
        .on("mouseenter", function (d) {
          div.transition()
              .duration(200)
              .style("opacity", .8);
          div.html("Name: " + d.name + "<br>Size: " + d.size + "<br>Language: " + languageIndex[d.language])
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
        })
        // hide the tooltip on mouseleave
        .on("mouseleave", function (d) {
          div.transition()
              .duration(500)
              .style("opacity", 0);
        })
        // when clicked, open the repository the node represents
        .on("click", function (d) {
            ztairaGithub = "https://github.com/ztaira14/";
            d3.event.stopPropagation();
            window.open(ztairaGithub + d.name);
        });
    // what to do when dragged
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

    // tick function
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

