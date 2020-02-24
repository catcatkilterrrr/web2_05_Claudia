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
	.innerRadius(radius-250)
	.outerRadius(radius-50);
let arcs;

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
		.attr("d", arc);
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
		
	path.transition().duration(100)
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

