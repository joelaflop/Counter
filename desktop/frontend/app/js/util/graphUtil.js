d3 = require("d3")
fs = require('fs')
const util = require('util');
swatches = require("d3-color-legend")
// import * as swatch from 'd3/color-legend';

module.exports = {
   countsBarGraph: function (data, location, objectType) {
      var maxDatum = 0;
      // var minDatum;
      data.forEach((d) => {
         if (d.count > maxDatum) {
            maxDatum = d.count
         }
         // if(d.count < minDatum){
         //    minDatum = d.count
         // }
      })

      margin = ({ top: 20, right: 0, bottom: 30, left: 15 })
      width = 500
      barHeight = 25
      height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom

      x = d3.scaleLinear()
         .domain([0, d3.max(data, d => d.count)])
         .range([margin.left, width - margin.right])

      y = d3.scaleBand()
         .domain(d3.range(data.length))
         .rangeRound([margin.top, height - margin.bottom])
         .padding(0.1)

      format = x.tickFormat(10, data.format)

      function wrap(s, len) {
         // console.log(`max:${maxDatum} ; curr:${len}`)
         if (s.length > 80 * len / maxDatum)
            return s.substring(0, 80 * len / maxDatum).trim() + '...'
         else return s
      }

      yAxis = g => g
         .attr("color", `white`)
         .attr("transform", `translate(${margin.left},0)`)
         .call(d3.axisRight(y).tickFormat(i => wrap(data[i][objectType], data[i].count)).tickSizeOuter(0))
         .call(g => g.select(".domain").remove())

      // xAxis = g => g
      //    .attr("color", `white`)
      //    .attr("transform", `translate(0,${margin.top})`)
      //    .call(d3.axisTop(x).ticks(width / 80, data.format))
      //    .call(g => g.select(".domain").remove())

      const svg = d3.create("svg")
         .attr("preserveAspectRatio", "xMidYMid meet")
         .attr("viewBox", [0, 0, width, height])
         .classed("svg-content-responsive", true);

      svg.append("g")
         .attr("fill", "steelblue")
         .selectAll("rect")
         .data(data)
         .join("rect")
         .attr("x", x(0))
         .attr("y", (d, i) => y(i))
         .attr("width", d => x(d.count) - x(0))
         .attr("height", y.bandwidth());

      svg.append("g")
         .attr("fill", "white")
         .attr("text-anchor", "end")
         .attr("font-family", "sans-serif")
         .attr("font-size", 12)
         .selectAll("text")
         .data(data)
         .join("text")
         .attr("x", d => x(d.count))
         .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
         .attr("dy", "0.35em")
         .attr("dx", -4)
         .text(d => format(d.count))
         .call(text => text.filter(d => x(d.count) - x(0) < 20) // short bars
            .attr("dx", +4)
            .attr("fill", "black")
            .attr("text-anchor", "start"));

      // svg.append("g")
      //    .call(xAxis);

      svg.append("g")
         .call(yAxis);

      svg.attr("width", "100%")
         .attr("height", "100%")

      d3.select("#" + location).selectAll('svg').remove();
      d3.select("#" + location).node().append(svg.node())
   },
   artistsSteamGraph: async function (data, location, legendLocation) {
      height = 500
      width = 500;

      margin = ({ top: 10, right: 20, bottom: 30, left: 20 })


      // data = Object.assign(await d3.csv('./unemployment-2.csv', d3.autoType), { y: "Unemployment" })
      // console.log(data)

      series = d3.stack()
         .keys(data.columns.slice(1))
         .offset(d3.stackOffsetWiggle)
         .order(d3.stackOrderInsideOut)
         (data)

      area = d3.area()
         .x(d => x(d.data.date))
         .y0(d => y(d[0]))
         .y1(d => y(d[1]))

      x = d3.scaleUtc()
         .domain(d3.extent(data, d => d.date))
         .range([margin.left, width - margin.right])

      y = d3.scaleLinear()
         .domain([d3.min(series, d => d3.min(d, d => d[0])), d3.max(series, d => d3.max(d, d => d[1]))])
         .range([height - margin.bottom, margin.top])

      var color = d3.scaleOrdinal()
         .domain(data.columns.slice(1))
         .range(d3.schemeCategory10)

      xAxis = g => g
         .attr("transform", `translate(0,${height - margin.bottom})`)
         .attr("color", `white`)
         .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
         .call(g => g.select(".domain").remove())

      const svg = d3.create("svg")
         .attr("viewBox", [0, 0, width, height]);

      svg.append("g")
         .selectAll("path")
         .data(series)
         .join("path")
         .attr("fill", ({ key }) => color(key))
         .attr("d", area)
         .append("title")
         .text(({ key }) => key);

      svg.append("g")
         .call(xAxis);

      svg.on('mouseover', function (v) {
         console.log('lmao')
      })

      var keys = data.columns.filter((e) => {
         if (e != 'date') {
            return e;
         }
      })

      // Add one dot in the legend for each name.


      d3.select("#" + location).selectAll('svg').remove();
      d3.select("#" + location).node().append(svg.node());
      if (legendLocation) {
         const legend = d3.create("svg")
            .style("width", 270)
         // .style("height", 250);

         legend.selectAll("mydots")
            .data(keys)
            .enter()
            .append("circle")
            .attr("cx", 20)
            .attr("cy", function (d, i) { return 20 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function (d) { return color(d) })

         // Add one dot in the legend for each name.
         legend.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 50)
            .attr("y", function (d, i) { return 20 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return color(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

         d3.select("#" + legendLocation).selectAll('svg').remove();
         d3.select("#" + legendLocation).node().append(legend.node());
      }
      // d3.select("#" + location).node().append(key)

      var vertical = d3.select("#" + location)
         .append("div")
         .attr("class", "remove")
         .style("position", "absolute")
         .style("z-index", "19")
         .style("width", "1px")
         // .style("height", `calc(${svg.style("height")} - 400px)`)
         .style("top", "40px")
         // .style("bottom", "300px")
         .style("left", "0px")
         .style("background", "#fff");

      d3.select("#" + location)
         .on("mousemove", function () {
            mousex = d3.mouse(this);
            mousex = mousex[0] + 100;
            minDistance = 100000;
            bestx = -1;
            for (i = 0; i < data.length; i++) {
               let e = (parseInt(svg.style("width")) * .002 + -.001) * x(data[i].date) + 100
               let dis = Math.abs(mousex - e)
               if (dis < minDistance) {
                  minDistance = dis;
                  bestx = e
               }
            }
            
            vertical.style("left", bestx + "px")
         })
         .on("mouseover", function () {
            mousex = d3.mouse(this);
            mousex = mousex[0] + 100;
            minDistance = 100000;
            bestx = -1;
            for (i = 0; i < data.length; i++) {
               let e = (parseInt(svg.style("width")) * .002 + -.001) * x(data[i].date) + 100
               let dis = Math.abs(mousex - e)
               if (dis < minDistance) {
                  minDistance = dis;
                  bestx = e
               }
            }

            vertical.style("left", bestx + "px").style("height", `calc(${svg.style("height")} - 3em)`)
         })




   },
}