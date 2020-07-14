d3 = require("d3")

module.exports = {
    countsBarGraph : function (data, location, objectType){
        margin = ({ top: 20, right: 0, bottom: 30, left: 150 })
        width = 500
        barHeight = 25
        height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom
        console.log(`height: ${height}`)
     
     
        x = d3.scaleLinear()
           .domain([0, d3.max(data, d => d.count)])
           .range([margin.left, width - margin.right])
     
        y = d3.scaleBand()
           .domain(d3.range(data.length))
           .rangeRound([margin.top, height - margin.bottom])
           .padding(0.1)
        format = x.tickFormat(2, data.format)
        
        function wrap(s){
            if(s.length > 27)
                return s.substring(0,27)+'...'
            else return s
        }
     
        yAxis = g => g
           .attr("color", `white`)
           .attr("transform", `translate(${margin.left},0)`)
           .call(d3.axisLeft(y).tickFormat(i => wrap(data[i][objectType])).tickSizeOuter(0))
     
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
     
        d3.select("#"+location).node().append(svg.node())
    }
}