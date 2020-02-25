// https://data.gov.sg/api/action/datastore_search?resource_id=7918b229-0e79-4d74-b725-e34183a56c01&limit=15
// api for recycled vs. disposed waste in SG from 2000-2014
let url = "https://data.gov.sg/api/action/datastore_search?resource_id=7918b229-0e79-4d74-b725-e34183a56c01&limit=15"
let radius = 100
let colors = ["SeaGreen","Tomato"]
let y = 2000;
let waste_JSON = {};
let pie = d3.pie();

let svg = d3.select("svg");
let width = svg.attr("width");
let height = svg.attr("height");
radius = Math.min(width, height) / 2;

let g = svg.append("g")
	   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
	   .attr("class", "arc");

let arc = d3.arc()
	.innerRadius(radius-150)
	.outerRadius(radius);
let arcs;
let tooltip = d3.select('body')
				.append('div')
				.style('background','white')
				.style('opacity', 0)
				.style('font-size', '18px')
				.style('color', 'black')
				.style('padding','2px')
				.style('position', 'absolute');

$.getJSON(url,function(data){
	for (let i = 0; i<data.result.records.length;i++){
		waste_JSON[parseInt(data.result.records[i].year)] = [parseFloat(data.result.records[i].waste_recycled),
															parseFloat(data.result.records[i].waste_disposed_of)];
	}
	
	$('#year').html(y);
	arcs = g.selectAll("arc")
		.data(pie(waste_JSON[y]))
		.enter()
		.append("path")
		.attr("fill", function(d,i){return colors[i%2];})
		.attr("id", function(d,i){console.log(i); return i;})
		.attr("d", arc)
		.on('mouseover', function(d){
			d3.select(this).transition().duration(250)
				.style('opacity',0.75);
			tooltip.html(`${d.data} million tonnes`)
				.style("left", (d3.event.layerX) + "px")
				.style("top", (d3.event.layerY) + "px");
			tooltip.transition().duration(550)
				.style('opacity', 1.0);

		})
		.on('mouseout', function(d){
			tooltip.style('opacity',0.0);
			d3.select(this).transition().duration(150)
			.style('opacity',1.0);
		});
});		

$('#forward').click(function(){
	if (y>=2014){
		return
	}
	y += 1;	
	$('#year').html(y);
	path = d3.select("svg").select("g")
		.selectAll("path")
		.data(pie(waste_JSON[y]))
		
	path.transition().duration(500)
		.attr("d", arc)
		.attr("fill", function(d,i){return colors[i%2];});
		//.attr("id", function(d,i){console.log(i); return i;})

});

$('#back').click(function(){
	if (y<=2000){
		return
	}
	y -= 1;
	$('#year').html(y);
	path = d3.select("svg").select("g")
		.selectAll("path")
		.data(pie(waste_JSON[y]))
		
	path.transition().duration(500)
		.attr("d", arc);
})

