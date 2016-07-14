var lineGraph = {};
lineGraph.getDimension = function() {
	var dimension = {};
	dimension.chartTopX = 100;
	dimension.chartTopY = 100;
	dimension.chartBottomX = 800;
	dimension.chartBottomY = 500;
	return dimension;
};
lineGraph.drawPath = function(svgContainer, data, dimension, yScale, xDistance) {
	var yPoints = data.map(function(element) { return dimension.chartBottomY - yScale(element.value);});
	var lines = svgContainer.append("g");
	lines.selectAll("line").data(yPoints).enter().append("line")
	.attr("x1", function(d, i) { return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5)); })
	.attr("y1", function(d, i) { return d; })
	.attr("x2", function(d, i) { 
		if(i==data.length-1)
			return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5));
		return dimension.chartTopX + ((xDistance/(data.length))*((i+1)+0.5)); 
	})
	.attr("y2", function(d, i) {
		if(i==data.length-1)
			return d;
		return yPoints[i+1];
	})
	.attr("stroke", "black");

	var circles = svgContainer.append("g");
	circles.selectAll("circle").data(yPoints).enter().append("circle")
	.attr("cx", function(d, i) {
		return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5));
	})
	.attr("cy", function(d, i) { return d; })
	.attr("r", 3)
	.style("fill", "red");
};

lineGraph.drawXTicks = function(tickLineGroup, data, dimension, xDistance) {
      tickLineGroup.selectAll("line").data(data).enter().append("line")
      .attr("x1", function(d, i) { return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5)); })
      .attr("y1", dimension.chartBottomY)
      .attr("x2", function(d, i) { return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5)); })
      .attr("y2", dimension.chartBottomY + 10)
      .attr("stroke", "black")
      .attr("stroke-opacity", 1);
};


lineGraph.getMaxValueOnYAxis = function(data) {
      var maxValue = data.reduce(function(obj, result) {
            if(obj.value > result.value) return obj;
            return result;
      }).value;
      return (maxValue%20) > 0 ? maxValue + (20-(maxValue%20)) : maxValue;
};

lineGraph.getChartDimension = function(data, metadata, maxValue) {
      var dimension = {};
      dimension.chartTopX = metadata['y'].length * 10 + 25 + (maxValue.toString().length * 10);
      dimension.chartTopY = 100;
      dimension.chartBottomX = dimension.chartTopX + (data.length * 50);
      dimension.chartBottomY = 500;
      return dimension;
};

lineGraph.maxLabelLength = function(data) {
      return data.map(function(obj) { return obj.label; })
            .reduce(function(prev, curr) { return prev.length>curr.length?prev:curr; }).length;
};

//drawAxis function
lineGraph.drawXAxis = function(lineGroup, dimension) {
      lineGroup.append("line")
      .attr("x1", dimension.chartTopX)
      .attr("y1", dimension.chartBottomY)
      .attr("x2", dimension.chartBottomX + 40)
      .attr("y2", dimension.chartBottomY)
      .attr("stroke","black");
};

lineGraph.drawYAxis = function(lineGroup, dimension) {
      lineGroup.append("line")
      .attr("x1", dimension.chartTopX)
      .attr("y1", dimension.chartBottomY)
      .attr("x2", dimension.chartTopX)
      .attr("y2", dimension.chartTopY - 20)
      .attr("stroke", "black");
};

lineGraph.drawLabelsOnXAxis = function(xLabelsGroups, data, dimension, xDistance, deviation) {
      xLabelsGroups.selectAll("text").data(data).enter().append("svg:text")
      .text(function(d) { return d.label;})
      .attr("class", "tick-label")
      .style("text-anchor" ,"end")
      .attr("transform", function (d, i)  {
            return "translate(" + (dimension.chartTopX + ((xDistance/(data.length))*(i+0.5) + deviation) + "," + ((dimension.chartBottomY) + 20)+") rotate(270)") });
};

lineGraph.getValuesOnYAxis = function(maxValue, numOfTicks) {
      var yAxisLabels = [];
      for(i = 0; i < numOfTicks; i++) 
            yAxisLabels.push((maxValue/(numOfTicks-1))*i);
      return yAxisLabels;
};

lineGraph.drawLabelsOnYAxis = function(yLabelsGroups, dimension, yAxisLabels, maxValue, maxValue, yScale) {
      yLabelsGroups.selectAll("text").data(yAxisLabels).enter().append("svg:text")
      .text(function(d) {return d;})
      .attr("x", dimension.chartTopX - maxValue.toString().length * 10)
      .attr("y", function(d, i) { return dimension.chartBottomY - yScale(d); });
};

lineGraph.drawBars = function(barGroup, data, dimension, yScale, xDistance) {
      barGroup.selectAll("rect").data(data).enter().append("rect")
      .attr("x", function(d, i) { return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5)); })
      .attr("y", function(d) { return dimension.chartBottomY - yScale(d.value); })
      .attr("width", 40).attr("height", function(d) { return yScale(d.value); })
      .style("fill", "#00b3dc");
};

lineGraph.drawBarLabels = function(barLabelGroups, data, dimension, yScale, xDistance) {
      barLabelGroups.selectAll("text").data(data).enter().append("svg:text")
      .attr("class", "tick-label")
      .attr("y", function(d) { return dimension.chartBottomY - yScale(d.value) - 10})
      .attr("x", function(d, i) { return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5)); })
      .text(function(d) { return d.value});
};

lineGraph.displayXAxisDescription = function(group, dimension, maxLength, xDistance, description) {
      var x_axis_label = group.append("g").attr("class", "x_axis_label");
      var x_label = x_axis_label.append("text")
      .attr("class", "x_axis_label")
      .attr("y", dimension.chartBottomY + (maxLength*10) + 20)
      .attr("x", dimension.chartTopX - (description.length*4) + (xDistance/2))
      .text(description)
      .style("font-weight", "bold")
      .style("font-size", "19px");
};
      
lineGraph.displayTableInfo = function( group , metadata , dimension, description){
      var graphDescription = group.append("g").attr("class", "graph_description");
      graphDescription.append("text").
            attr("class", "graph_description")
            .attr("y", dimension.chartTopY - 50)
            .attr("x", dimension.chartTopX + 100)
            .text(description)
            .style("font-weight", "bold")
            .style("font-size", "19px");
}

lineGraph.displayYAxisDescription = function(group, dimension, yDistance, metadata) {
      var y_axis_label = group.append("g").attr("class", "y_axis_label")
      var y_label = y_axis_label.append("text")
      .attr("class", "y_axis_label")
      .attr("y", dimension.chartTopY + (yDistance/2))
      .attr("x", 25)
      .text(metadata.y)
      .style("font-weight", "bold")
      .style("font-size", "19px");  
};

lineGraph.displayValue = function(percentageGroups , data , xDistance , chartBottomY , yScale, chartTopX){
      percentageGroups.selectAll("text").data(data).enter().append("svg:text")
            .text(function(d) { return d.value;})
            .attr("class", "tick-label")
            .attr("y", function(d) { return chartBottomY - yScale(d.value) - 10})
            .attr("x", function(d, i) { return chartTopX + ((xDistance/(data.length))*(i+0.5)); });
};

lineGraph.drawYTicks = function(tickLineGroup, yAxisLabels, yScale, dimension) {
      tickLineGroup.selectAll("line").data(yAxisLabels).enter().append("line")
      .attr("x1", dimension.chartTopX)
      .attr("y1", function(d, i) { return dimension.chartBottomY - yScale(d); })
      .attr("x2", dimension.chartBottomX)
      .attr("y2", function(d, i) { return dimension.chartBottomY - yScale(d); })
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.09);
};

lineGraph.drawXTicks = function(tickLineGroup, data, dimension, xDistance) {
      tickLineGroup.selectAll("line").data(data).enter().append("line")
      .attr("x1", function(d, i) { return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5)) + 20; })
      .attr("y1", dimension.chartBottomY)
      .attr("x2", function(d, i) { return dimension.chartTopX + ((xDistance/(data.length))*(i+0.5)) + 20; })
      .attr("y2", dimension.chartBottomY + 10)
      .attr("stroke", "black")
      .attr("stroke-opacity", 1);
};

lineGraph.draw = function(data, metadata) {
      var svgContainer = d3.select("body").append("svg").attr("width",1100).attr("height",1100); 
      var maxValue = this.getMaxValueOnYAxis(data);
      var dimension = this.getChartDimension(data, metadata, maxValue);

      var numOfTicks = 5;
      var yDistance = dimension.chartBottomY - dimension.chartTopY;
      var xDistance = dimension.chartBottomX - dimension.chartTopX;
      var group = svgContainer.append("g");

      var yScale = d3.scale.linear().domain([0, maxValue]).range([0, yDistance]);

      var lineGroup = group.append("g").attr("class", "line");
      this.drawYAxis(lineGroup, dimension);
      this.drawXAxis(lineGroup, dimension);      
      
      var xLabelsGroups = group.append("g").attr("class", "x-labels")
      this.drawLabelsOnXAxis(xLabelsGroups, data, dimension, xDistance, 20);

      var yLabelsGroups = group.append("g").attr("class", "y-labels");
      var yAxisLabels = this.getValuesOnYAxis(maxValue, numOfTicks);
      this.drawLabelsOnYAxis(yLabelsGroups, dimension, yAxisLabels, maxValue, maxValue, yScale);
      
      var xTickLineGroup = group.append("g").attr("class", "x-tick-lines");
      var yTickLineGroup = group.append("g").attr("class", "y-tick-lines");

      this.drawYTicks(xTickLineGroup, yAxisLabels, yScale, dimension);
      this.drawXTicks(yTickLineGroup, data, dimension, xDistance);

      var barGroup = group.append("g").attr("class", "bars");
      this.drawBars(barGroup, data, dimension, yScale, xDistance);

      var barLabelGroups = group.append("g").attr("class", "bar-label");

      var maxLength = this.maxLabelLength(data);
      this.displayXAxisDescription(group, dimension, maxLength, xDistance, metadata.x);
      this.displayYAxisDescription(group, dimension, yDistance, metadata);

      var description = "Bar Graph: "  + metadata.x + " vs " + metadata.y;
      this.displayTableInfo(group , metadata ,dimension, description);

      var percentageGroups = group.append("g").attr("class", "percentage")
      this.displayValue(percentageGroups , data , xDistance , dimension.chartBottomY ,yScale, dimension.chartTopX);
};

lineGraph.draw = function(data, metadata) {
       var svgContainer = d3.select("body").append("svg").attr("width",1100).attr("height",1100); 
	var maxValue = 1.0;
	var numOfTicks = 10;
	var dimension = this.getDimension();

	var yDistance = dimension.chartBottomY - dimension.chartTopY;
	var xDistance = dimension.chartBottomX - dimension.chartTopX;
	var group = svgContainer.append("g");

	var yScale = d3.scale.linear().domain([0, maxValue]).range([0, yDistance]);

	var lineGroup = group.append("g").attr("class", "line");
	lineGraph.drawYAxis(lineGroup, dimension);
	lineGraph.drawXAxis(lineGroup, dimension);  

	var xLabelsGroups = group.append("g").attr("class", "x-labels");
	lineGraph.drawLabelsOnXAxis(xLabelsGroups, data, dimension, xDistance, 0);
	
	var yLabelsGroups = group.append("g").attr("class", "y-labels");
    var yAxisLabels = lineGraph.getValuesOnYAxis(maxValue, numOfTicks);
    lineGraph.drawLabelsOnYAxis(yLabelsGroups, dimension, yAxisLabels, maxValue, maxValue, yScale);
    var xTickLineGroup = group.append("g").attr("class", "x-tick-lines");
    this.drawXTicks(xTickLineGroup, data, dimension, xDistance);

    var yTickLineGroup = group.append("g").attr("class", "y-tick-lines");
    lineGraph.drawYTicks(yTickLineGroup, yAxisLabels, yScale, dimension);
	
	this.drawPath(group, data, dimension, yScale, xDistance);

	var maxLength = lineGraph.maxLabelLength(data);
  	lineGraph.displayXAxisDescription(group, dimension, maxLength, xDistance, metadata.x);
	lineGraph.displayYAxisDescription(group, dimension, yDistance, metadata);

	var chartDescription = "Line Graph: " + metadata.x + " vs " +metadata.y;
	lineGraph.displayTableInfo(group, metadata, dimension, chartDescription);
}