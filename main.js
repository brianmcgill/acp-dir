
var margin = {top: 20, right: 30, bottom: 40, left: 130},
    dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
    width = dim - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scaleLinear().rangeRound([0, width]);

var y = d3.scaleBand().rangeRound([height, 0]);

//var r = d3.scale.linear().range([7, 18]);

var color = d3.scaleOrdinal()
      .range(['#699246','#C43B82','#7A3842','#3A2C70','#C44244','#3A9C9B','#EACD3F','#1F8FBA','#F08031','#ABBF48','#86563E','#82477F','#457A59','#2E547A','#FCB93A']);

var xAxis = d3.axisBottom(x)//.tickFormat(d3.format(".0%"));

var yAxis = d3.axisLeft(y);

var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js
function pctDecimal(num) {
  return Math.round(num *1000)/10 +"%"
}

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<div><span style='color:white'>" + d.countyname + ", " + d.state + "</span></div>";
   })

svg.call(tip);

d3.csv("acpdata.csv", function(error, data) {
  if (error) throw error;

  //var subset = data.filter(function(el){return el.Metric === 'Cost'});

  data.forEach(function(d) {
    d.type = +d.type;
    d.typename = d.typename
    d.obesity = +d.obesity
    d.uninsured = +d.uninsured
    d.death = +d.death
    d.childpoverty = +d.childpoverty
    d.longcommute = +d.longcommute
    d.overdose = +d.overdose
    d.income = +d.income
    d.nhwhite = +d.nhwhite;
  });

  d3.csv("acpaverage.csv", function(error, avg) {

    avg.forEach(function(d) {
      d.type = +d.type;
      d.typename = d.typename
      d.obesity = +d.obesity
      d.uninsured = +d.uninsured
      d.death = +d.death
      d.childpoverty = +d.childpoverty
      d.longcommute = +d.longcommute
      d.overdose = +d.overdose
      d.income = +d.income
      d.nhwhite = +d.nhwhite;
    });

  x.domain([0, d3.max(data, function(d) { return d.uninsured; })]);
  y.domain(data.map(function(d) { return d.typename; }));
  //r.domain(d3.extent (subset, function (d)  {return d.TotalValue;}));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      /*.append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Uninsured Percentage");*/

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  const circles = svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")

      circles.attr("class", "dot")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.uninsured); })
      .attr("cy", function(d) { return y(d.typename); })
      .style("fill", function(d) {return color(d.type); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  const rect = svg.selectAll('.blackrect')
      .data(avg)
      .enter().append("rect")

      rect.attr('class', 'avgz')
      .attr('x', function(d) { return x(d.uninsured)-1; })
      .attr('y', function(d) { return y(d.typename)-10; })

  //button transitions
  function btnTrans(hed, cat, xMax, circ) {

    d3.select("#" + cat + "-btn").on("click",function(e) {

      d3.select(".hed").text(hed)

      x.domain([0, d3.max(data, xMax)]); 
      xAxis = d3.axisBottom(x)//.tickFormat(d3.format(".0%")); 

      svg.selectAll(".x.axis")
        .transition()
        .duration(1300)
        .call(xAxis);

      const delay = function(d, i) { return i * 0.2; };
      circles.transition()
        .duration(1300)
        .delay(delay)
        .ease(d3.easeElastic)
        .attr("cx", circ)   

      rect.transition()
        .duration(1300)
        .delay(delay)
        .ease(d3.easeElastic)
        .attr("x", circ)   

    });   
  };

  //call buttons
  btnTrans("Uninsured Rate", "uninsured", function(d) { return d.uninsured; }, function(d) { return x(d.uninsured) });
  btnTrans("Obesity Rate","obesity",  function(d) {return d.obesity; }, function(d) { return x(d.obesity) });
  btnTrans("Premature Deaths per 100,000 People","death",  function(d) {return d.death; }, function(d) { return x(d.death) });
  btnTrans("Children in Poverty, Pct.","childpoverty",  function(d) {return d.childpoverty; }, function(d) { return x(d.childpoverty) });
  btnTrans("People with a Commute Over 30 Minutes, Pct.","longcommute",  function(d) {return d.longcommute; }, function(d) { return x(d.longcommute) });
  btnTrans("Drug Overdose Deaths per 100,000 People","overdose",  function(d) {return d.overdose; }, function(d) { return x(d.overdose) });
  btnTrans("Median Household Income ($)","income",  function(d) {return d.income; }, function(d) { return x(d.income) });
  btnTrans("Non-Hispanic White Pct.","nhwhite",  function(d) {return d.nhwhite; }, function(d) { return x(d.nhwhite) });

})
});

function resize() {

  var dim = Math.min(parseInt(d3.select("#chart").style("width"))),
  width = dim - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

  console.log(dim);

  // Update the range of the scale with new width/height
  x.range([0, width]);
  y.range([height, 0]);

  // Update the axis and text with the new scale
  svg.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.select('.x.axis').select('.label')
      .attr("x",width);

  svg.select('.y.axis')
    .call(yAxis);

  // Update the tick marks
  xAxis.ticks(dim / 75);
  yAxis.ticks(dim / 75);

  d3.select(".hed").text("Uninsured Rate")

  // Update the circles
  //r.range([dim / 90, dim / 35])

  svg.selectAll('.dot')
    .attr("r", 6)
    .attr("cx", function(d) { return x(d.uninsured); })
    .attr("cy", function(d) { return y(d.typename); })

  svg.selectAll('.avgz')
    .attr("x", function(d) { return x(d.uninsured)-1; })
    .attr("y", function(d) { return y(d.typename)-10; })
}

d3.select(window).on('resize', resize);

resize();