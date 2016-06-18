var startYear = 1980;
var sliderYear = 1980;	

// define slider
var slider = d3.slider().axis(true).min(startYear).max(2012).value(startYear).step(1);
d3.select('#slider').call(slider);			

// Define Widths and heights and margins
var margin_map = {top: 5, right: 10, bottom: 5, left: 10},
	margin_bar = {top: 20, right: 0, bottom: 50, left: 55};
var w = 580 - margin_map.left - margin_map.right,
	w2 = 300 - margin_bar.left - margin_bar.right,
    h = 740 - margin_map.top - margin_map.bottom,
    h2 = 262 - margin_bar.top - margin_bar.bottom;

// Define map projection
var projection = d3.geo.transverseMercator()
      				   .rotate([-77.82519, -15.394, 0])
      				   .translate([w/2, h/2])
      				   .scale(420000);


// Define path generator
var path = d3.geo.path()
				 .projection(projection);

var pathWells = d3.geo.path()
				 .projection(projection);



// Define scales for well map
var colorDepth = d3.scale.threshold()
					.domain([10, 50, 100, 300])
					.range(["#deebf7", "#6baed6","#2171b5", "#08306b"]);

var colorType = d3.scale.ordinal()
						.domain(["Open Well", "Agricultural Borewell", "Domestic Borewell"])
						.range(["#C4ED68", "#59A80F", "#ba831f"])

var colorStatus = d3.scale.ordinal()
						  .domain(["Defunct", "Fails every summer", "Fails during droughts", "Has never failed"])
						  .range(["#784860", "#C07860", "#F8CA8C", "#FFF4C2"])



var dem_colors = ["#227516", "#648744", "#9bc133", "#cdcb32", "#fed976", "#ffeda0", "#ffffcc", "#d7cebf", "#b6b098", "#986b41", "#561f10"]
var dem_breaks = ["0%", "5%", "9%", "17%", "24%", "33%", "43%", "52%", "64%", "76%", "100%"]
var dem_scale = d3.scale.linear().domain([390, 620]).range([0, 170]);

var svg_map = d3.select("#well-viz-map").append("svg")
	.attr("width", w + margin_map.left + margin_map.right)
	.attr("height", h + margin_map.top + margin_map.bottom)
		.append("g")
	.attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")");

svg_map.append("rect")
	.attr("class", "mapBorder")
	.attr("x", 0)
	.attr("y", 0)
	.attr("height", h)
	.attr("width", w)

svg_map.append("svg:image")
		.attr("xlink:href", "/assets/data/background.jpg")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 560)
		.attr("height", 730);

// Create legend and add static features
var legend = d3.select("#legend").append("svg")
	   .attr("id", "legendSVG")
	   .attr("width", 195)
	   .attr("height", 200)
       .append("g")
       .attr("id", "legendBox")


dem_legend = legend.append("g")
	   				.attr("width", 170)
	   				.attr("height", 15)
	   				.attr("transform", "translate(" + 15 + "," + 45 + ")");       

var gradientDEM = dem_legend.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

for (var i = 0; i < dem_colors.length; i++) {
	gradientDEM.append("stop")
    .attr("offset", dem_breaks[i])
    .attr("stop-color", dem_colors[i])
    .attr("stop-opacity", 0.6)
}

var gradientBar = dem_legend.append("rect")
				        .attr("y", 0)
				        .attr("width", 170)
				        .attr("height", 15)
				        .attr("fill","url(#gradient)")
				        .style("stroke", "black")
				        .style("stroke-width", 1);

var dem_Axis = d3.svg.axis().scale(dem_scale).orient("top").tickValues([390, 500, 620]);

dem_legend.append("g").attr("class", "x axis demAxis")
				.call(dem_Axis).append("text")
				.attr("x", 0)
				.attr("y", -25)
				.text("Elevation (metres)")
				.style("font-size", "12px");;


var boundaryLegend = legend.append("g")
						   .attr("id", "boundaryLegend")
						   .attr("transform", "translate(" + 15 + "," + 80 + ")")

boundaryLegend.append("line")
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 15)
	.attr("y2", 0)
	.style("stroke", "black")
	.style("stroke-width", 1.5)
	.style("shape-rendering", "auto");

boundaryLegend.append("text")
	.attr("x", 32)
	.attr("y", 5)
	.text("Revenue village boundary")
	.style("font-size", "12px");

var drainageLegend = legend.append("g")
						   .attr("id", "boundaryLegend")
						   .attr("transform", "translate(" + 15 + "," + 100 + ")")

drainageLegend.append("line")
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 15)
	.attr("y2", 0)
	.style("stroke", "#1f78b4")
	.style("stroke-width", 1.5)
	.style("shape-rendering", "auto");

drainageLegend.append("text")
	.attr("x", 32)
	.attr("y", 5)
	.text("Drainage")
	.style("font-size", "12px")

var dhoneLegend = legend.append("g")
						   .attr("id", "dhoneLegend")
						   .attr("transform", "translate(" + 15 + "," + 139 + ")")

dhoneLegend.append("rect")
			  	 .attr("width", 15)
			  	 .attr("height", 10)
			  	 .style("stroke", "#7e864f")
			  	 .style("fill", "#acb08c")
			  	 .style("opacity", 0.6)
			  	 .style("shape-rendering", "auto");

dhoneLegend.append("text")
		  	 .attr("x", 32)
		  	 .attr("y", 10)
		  	 .text("Dhone Town")
		  	 .style("font-size", "12px");

dhoneLegend.append("line")
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 15)
	.attr("y2", 10)
	.style("stroke", "#7e864f")
	.style("stroke-width", 1.5)
	.style("shape-rendering", "auto");

function drawFeatures() {

	d3.json("/assets/data/village_areas.json", function(json2) {

		svg_map.selectAll("path.features")
	   		.data(json2.features)
	   		.enter()
	   		.append("path")
	   		.attr("d", path)
	   		.attr("class", "village-boundaries")
	   		.style("fill", "#DF837D")
	   		.style("opacity", 0.5)
	   		.style("stroke", "red");

	var villageLegend = legend.append("g")
						   .attr("id", "boundaryLegend")
						   .attr("transform", "translate(" + 15 + "," + 116 + ")")

	villageLegend.append("rect")
			  	 .attr("width", 15)
			  	 .attr("height", 10)
			  	 .style("stroke", "red")
			  	 .style("fill", "#DF837D")
			  	 .style("opacity", 0.5)
			  	 .style("shape-rendering", "auto");

	villageLegend.append("text")
			  	 .attr("x", 32)
			  	 .attr("y", 10)
			  	 .text("Village areas")
			  	 .style("font-size", "12px");
	});

	drawWells();
}

// Create chart SVGs
var svg_type = d3.select("#well-viz-chart2").append("svg")
			.attr("width", w2 + margin_bar.left + margin_bar.right)
			.attr("height", h2 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var svg_depth = d3.select("#well-viz-chart1").append("svg")
			.attr("width", w2 + margin_bar.left + margin_bar.right)
			.attr("height", h2 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var svg_status = d3.select("#well-viz-chart3").append("svg")
			.attr("width", w2 + margin_bar.left + margin_bar.right)
			.attr("height", h2 + margin_bar.top + margin_bar.bottom)
				.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

// Create chart scales
xType = d3.scale.ordinal()
	.rangeRoundBands([0, w2], 0.05);
	yType = d3.scale.linear()
		.range([h2, 0]);

	xDepth = d3.scale.ordinal()
	.rangeRoundBands([0, w2], 0.05);
	yDepth = d3.scale.linear()
		.range([h2, 0]);

	xStatus = d3.scale.ordinal()
	.rangeRoundBands([0, w2], 0.05);
	yStatus = d3.scale.linear()
		.range([h2, 0])

	
function drawWells(){	   

	d3.csv("/assets/data/dhone_wells.csv", function(data) {
	
		var wells = svg_map.selectAll("circle")
	   					    .data(data)
	   					    .enter()
	   					    .append("circle")
	   					    .attr("cx", function(d){
	   							return projection([d.lon, d.lat])[0];
	   						})
	   					    .attr("cy", function(d){
	   							return projection([d.lon, d.lat])[1];
	   						}) 
	   					    .attr("r", function(d){
	   							if(d.year <= startYear){
	   								return 3;
	   							} else{
	   								return 0;
	   							}
	   						})
						    .attr("class", "well")
							.style("fill", function(d){
								if (d.depth){
			   						return colorDepth(d.depth);
								}else{
			   						return "#ccc";
								}
							})
							.style("opacity", 0.85)
							.on("mouseover", function(d){
								d3.select(this)
								  .attr("r", 8)
								
								svg_map.append("text")	
									   .attr("id", "tooltip")
		   							   .attr("x", parseFloat(projection([d.lon, d.lat])[0]) + 7)
		   							   .attr("y", parseFloat(projection([d.lon, d.lat])[1]) - 7)
		   							   .attr("text-anchor", "left")
		  							   .attr("font-family", "sans-serif")
		  							   .attr("font-size", "14px")
		   							   .attr("font-weight", "bold")
		  							   .attr("fill", "black")
		   							   .text("Depth: " + d.depth + " metres");	
							})
							.on("mouseout", function(){
								d3.select(this).attr("r", 3)
								d3.select('#tooltip').remove();
							});
		createCharts(data);
		sliderActivate(wells, data);
	});

}	
	
function updateLegend(attr){
		
	legend.select("#legendGroup").remove();			
	
	wellLegend = legend.append("g")
		.attr("id", "legendGroup")
			.attr("transform", "translate(" + 22 + "," + 167 + ")")
			.selectAll("g")
			.data(attr.domain())
			.enter()
			.append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
  			var height = 25;
  			var horz = 0;
  			var vert = i * height;
  			return "translate(" + horz + "," + vert + ")";
			});

	wellLegend.append("circle")
			.attr("r", 7)
			.style("fill", attr)
			.style("stroke", attr);

		wellLegend.append("text")
			.attr("x", 25)
			.attr("y", 6)
			.text(function(d) { 
				if(attr === colorDepth){
					if(d === 10){
						return "0 - 10 metres";
					} else if (d === 50){
						return "10 - 50 metres";
					}else if (d === 100){
						return "50 - 100 metres";
					}else if (d === 300){
						return "100 + metres";
					}
				} else{
					return d
				}
			})
			.style("font-size", "12px");

		height = document.getElementById("legendBox").getBBox().height;	
	width = document.getElementById("legendBox").getBBox().width;
	d3.select("#legendSVG").attr("height", height + 15).attr("width", width + 13);
	}


function createButtons(){

d3.select("#wellDepthButton").style("background-color", "#FAE9BD")
						   	 .style("border-width", "1px");

d3.selectAll(".button")
	.on("mouseover", function(){
		d3.select(this).style("opacity", 1)
					   .style("border-width", "2px")
					   .style("margin", "0px");
	})
	.on("mouseout", function(){
		d3.select(this).style("opacity", 0.8)
					   .style("border-width", "1px")
					   .style("margin", "1px");
	})
	.on("click", function(){
		var buttonText = this.textContent;

		d3.selectAll(".button").style("background-color", "#DDDDDD")
					           .style("border-width", "1px");						   
		d3.select(this).style("background-color", "#FAE9BD")
					   .style("border-width", "2px");
						   
			// Update well color scheme
		svg_map.selectAll(".well")
			.style("fill", function(d){
				if (buttonText === "Well Type"){
					if (d.type){
			   			return colorType(d.type);
					}
					else{
						return "#ccc";
					}
				}else if(buttonText === "Well Depth"){
					if (d.depth){
			   			return colorDepth(d.depth);
					}
					else{
						return "#ccc";
					}
				}else if(buttonText == "Well Status (2012)"){
					if(d.status){
						return colorStatus(d.status);
					}else{
						return "#ccc";
					}
				}else{
					return "#ccc"
				}
				})

			// Update legend
		if(buttonText === "Well Depth"){
			updateLegend(colorDepth);
		}else if(buttonText === "Well Type"){
			updateLegend(colorType);
		}else if(buttonText === "Well Status (2012)"){
			updateLegend(colorStatus);
		}
	})
}

function createCharts(data){		

	// Group data and define scale domains for type bar chart using complete dataset
	var wellTypes = countWells(data, "type", 2012);
	xType.domain(d3.range(wellTypes.length))
	yType.domain([0, 280])
	
	// Add axes for type bar chart
	svg_type.append("g")
	.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yType)
		.orient("left"));

		svg_type.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xType)
		.orient("bottom")
		.tickFormat(function(d){return wellTypes[d].key;}))
		.selectAll(".tick text")
			.call(wrap, xType.rangeBand());

		// Add axes titles for type chart 
		svg_type.append("text")
		.attr("transform", "translate(" + (w2 / 2) + " ," + (h2 + margin_bar.bottom - 5) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.text("Well Type")

	svg_type.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 20)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.text("Number of Wells");

	// Regroup data	for start year
    wellTypes = countWells(data, "type", startYear);

    // Add bars for type chart
	var typeChart = svg_type.selectAll("rect")
   		.data(wellTypes)		
   		.enter()
   		.append("rect")
   		.attr("x", function(d, i) {
   			return xType(i);
   		})
   		.attr("y", function(d) {
   			return yType(d.values);
   		})
   		.attr("width", xType.rangeBand())
   		.attr("height", function(d) {
   			return h2 - yType(d.values);
   		})
   		.style("fill", function(d){
   			if(d.key === "Open Well"){
   				return "#C4ED68"
   			} else if(d.key === "Agricultural Borewell"){
   				return "#59A80F"
   			} else if(d.key === "Domestic Borewell"){
   				return "#ba831f"
   			}
   		})
   		.style("opacity", 0.7)
   		.on("mouseover", function(d){
				d3.select(this)
				.style("opacity", 1);

				svg_map.selectAll(".well")
				.attr("r", function(j){
	   				if (j.year <= sliderYear){
	   					if(d.key === j.type){
	   						return 3.5;
	   					}else{
	   						return 0;
	   					}
	   				}else{
	   					return 0;
	   				}
	   			});
	   			
		})
		.on("mouseout", function(d){
				d3.select(this)
				.style("opacity", 0.7);

				svg_map.selectAll(".well")
				.attr("r", function(j){
	   				if(j.year <= sliderYear){
	   					return 3;
	   				}else{
	   					return 0;
	   				}
	   			});
		});

   	// Group data and define scale domains for depth bar chart using complete dataset
   	var wellDepths = countWells(data, "depth_bin", 2012);
	xDepth.domain(d3.range(wellDepths.length))
	yDepth.domain([0, 280])
	
	// Add axes for depth bar chart
	svg_depth.append("g")
	.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yDepth)
		.orient("left"));

		svg_depth.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xDepth)
		.orient("bottom")
		.tickFormat(function(d){return wellDepths[d].key;}));

		// Add axes titles for depth chart 
		svg_depth.append("text")
		.attr("transform", "translate(" + (w2 / 2) + " ," + (h2 + margin_bar.bottom - 15) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.text("Well Depth (metres)")

	svg_depth.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 20)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.text("Number of Wells");

	// Regroup data	for start year	
	wellDepths = countWells(data, "depth_bin", startYear);
	
	// Add bars for depth chart
	var chart2 = svg_depth.selectAll("rect")
   		.data(wellDepths)		
   		.enter()
   		.append("rect")
   		.attr("x", function(d, i) {
   			return xDepth(i);
   		})
   		.attr("y", function(d) {
   			return yDepth(d.values);
   		})
   		.attr("width", xDepth.rangeBand())
   		.attr("height", function(d) {
   			return h2 - yDepth(d.values);
   		})
   		.style("fill", function(d){
   			if(d.key === "0 - 10"){
   				return "#deebf7";
   			} else if (d.key === "10 - 50"){
   				return "#6baed6";
   			} else if (d.key === "50 - 100"){
   				return "#2171b5";
   			} else if(d.key === "100 +"){
   				return "#08306b";
   			}
   		})
   		.style("opacity", 0.7)
   		.on("mouseover", function(d){
				d3.select(this)
				.style("opacity", 1);

				svg_map.selectAll(".well")
				.attr("r", function(j){
	   				if (j.year <= sliderYear){
	   					if(d.key === j.depth_bin){
	   						return 3.5;
	   					}else{
	   						return 0;
	   					}
	   				}else{
	   					return 0;
	   				}
	   			});
		})
		.on("mouseout", function(d){
				d3.select(this)
				.style("opacity", 0.7);

				svg_map.selectAll(".well")
				.attr("r", function(j){
	   				if(j.year <= sliderYear){
	   					return 3;
	   				}else{
	   					return 0;
	   				}
	   			});
		});

	// Group data and define scale domains for status bar chart using complete dataset
	var wellStatus = countWells(data, "status", 2012);
	xStatus.domain(d3.range(wellStatus.length))
	yStatus.domain([0, 280])
	
	// Add axes for status bar chart
	svg_status.append("g")
	.attr("class", "y axis")
		.call(d3.svg.axis()
		.scale(yStatus)
		.orient("left"));

		svg_status.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, " + h2 + ")")
		.call(d3.svg.axis()
		.scale(xStatus)
		.orient("bottom")
		.tickFormat(function(d){return wellStatus[d].key;}))
		.selectAll(".tick text")
			.call(wrap, xStatus.rangeBand());

		// Add axes titles for type chart 
		svg_status.append("text")
		.attr("transform", "translate(" + (w2 / 2) + " ," + (h2 + margin_bar.bottom - 5) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.text("Well Status (2012)")

	svg_status.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin_bar.left + 20)
		.attr("x",0 - (h2 / 2))
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.text("Number of Wells");

	// Regroup data	for start year
    wellStatus = countWells(data, "status", startYear);

    // Add bars for status chart
	var statusChart = svg_status.selectAll("rect")
   		.data(wellStatus)		
   		.enter()
   		.append("rect")
   		.attr("x", function(d, i) {
   			return xStatus(i);
   		})
   		.attr("y", function(d) {
   			return yStatus(d.values);
   		})
   		.attr("width", xStatus.rangeBand())
   		.attr("height", function(d) {
   			return h2 - yStatus(d.values);
   		})
   		.style("fill", function(d){
   			if(d.key === "Defunct"){
   				return "#784860"
   			} else if(d.key === "Fails every summer"){
   				return "#C07860"
   			} else if(d.key === "Fails during droughts"){
   				return "#F8CA8C"
   			} else if(d.key === "Has never failed"){
   				return "#FFF4C2"
   			}
   		})
   		.style("opacity", 0.7)
   		.on("mouseover", function(d){
				d3.select(this)
				.style("opacity", 1);

				svg_map.selectAll(".well")
				.attr("r", function(j){
	   				if (j.year <= sliderYear){
	   					if(d.key === j.status){
	   						return 3.5;
	   					}else{
	   						return 0;
	   					}
	   				}else{
	   					return 0;
	   				}
	   			});
	   			
		})
		.on("mouseout", function(d){
				d3.select(this)
				.style("opacity", 0.7);

				svg_map.selectAll(".well")
				.attr("r", function(j){
	   				if(j.year <= sliderYear){
	   					return 3;
	   				}else{
	   					return 0;
	   				}
	   			});
		});
}			


function sliderActivate(wells, data){		// slider event 
    
    slider.on("slide", function(evt, value){
			
		sliderYear = value;
		
		d3.select('#slidertext').text(value);
		
		// update wells on map
		wells.attr("r", function(d){
				if(d.year <= value){
					return 3;
				} else{
					return 0;
				}
			  })

		// Update type chart
		wellTypes = countWells(data, "type", value);
		var bars1 = svg_type.selectAll("rect")
				            .data(wellTypes);
		bars1.transition()
			 .duration(100)
			 .attr("y", function(d) {
					return yType(d.values);
			 })
			 .attr("height", function(d) {
					return h2 - yType(d.values);
			 })

			//Update depth chart	
		wellDepths = countWells(data, "depth_bin", value);
		var bars2 = svg_depth.selectAll("rect")
				             .data(wellDepths);
		bars2.transition()
			 .duration(100)
			 .attr("y", function(d) {
				return yDepth(d.values);
			 })
			 .attr("height", function(d) {
				return h2 - yDepth(d.values);
			 })

			//Update Status chart	
		wellStatus = countWells(data, "status", value);
		var bars3 = svg_status.selectAll("rect")
				              .data(wellStatus);
		bars3.transition()
			 .duration(100)
			 .attr("y", function(d) {
				return yStatus(d.values);
			 })
			 .attr("height", function(d) {
				return h2 - yStatus(d.values);
			 })

	});
}		
			


function countWells(data, attr, year){
					
	var nested = d3.nest()
    	.key(function(d) {
        	return d[attr];
        	})
    	.rollup(function(wells) {

        	var count = d3.sum(wells, function(d) {
        		if(d['year'] <= year){;
            		return d['count'];
            	}		
        });
        return count;
    })
    .entries(data);
    return nested;
}

function wrap(text, width) {
	text.each(function() {
		var text = d3.select(this),
	    	words = text.text().split(/\s+/).reverse(),
	    	word,
	    	line = [],
	    	lineNumber = 0,
	    	lineHeight = 1.1, // ems
	    	y = text.attr("y"),
	    	dy = parseFloat(text.attr("dy")),
	    	tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
	  		line.push(word);
	  		tspan.text(line.join(" "));
	  		if (tspan.node().getComputedTextLength() > width) {
	    		line.pop();
	    		tspan.text(line.join(" "));
	    		line = [word];
	    		tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      		}
   		 }
  	});
}

function createWellVis(){
	drawFeatures();
	var wellLegend = legend.append("g").attr("id", "legendGroup");
	updateLegend(colorDepth);
	createButtons();
}

createWellVis();