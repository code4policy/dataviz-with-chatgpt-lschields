// bar_chart.js

// Load the CSV data
d3.csv('boston_311_2023_by_reason.csv').then(function(data) {
  data.forEach(d => {
      d.Count = +d.Count;
  })

  // Sort the data by Count in descending order
  data.sort((a, b) => b.Count - a.Count);

  // Select the top 10 reasons
  const topReasons = data.slice(0, 10);

  // Set up svg
  const screenWidth = window.innerWidth;
  const svgWidth = screenWidth;
  const svgHeight = 1000;
  const margin = {top: 40, right: 40, bottom: 80, left: 200 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

// Create SVG container with custom margins
  const svg = d3.select('#chart-container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Set up scales with updated domains
   const yScale = d3.scaleBand()
    .domain(topReasons.map(d => d.reason))
    .range([0, height])
    .padding(0.2);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(topReasons, d => d.Count)])
    .range([0, width]);

  // Create bars
  svg.selectAll('rect')
    .data(topReasons)
    .enter()
    .append('rect')
    .attr('x', 0) // Start from the left edge
    .attr('y', d => yScale(d.reason))
    .attr('width', d => xScale(d.Count))
    .attr('height', yScale.bandwidth())
    .attr('fill', '#288BE4')
    .on('mouseover', function (event, d) {
      d3.select(this).attr('fill', '#091f2f');
    })
    .on('mouseout', function () {
      d3.select(this).attr('fill', '#288be4');
    });

   //Add labels for each bar (inside the bars)
  svg.selectAll('text')
    .data(topReasons)
    .enter()
    .append('text')
    .attr('class', 'bar-label-inside')
    .text(d => d.reason)
    .attr('x', 5) // Offset from the left edge of the bar
    .attr('y', d => yScale(d.reason) + yScale.bandwidth() / 2)
    .attr('dy', '0.35em') // Vertical alignment to the middle of the bar
    .attr('fill', 'white')
    .on('mouseover', function (event, d) {
      d3.select(this.parentNode.querySelector('rect')).attr('fill', '#091f2f');
    })
    .on('mouseout', function () {
      d3.select(this.parentNode.querySelector('rect')).attr('fill', '#288be4');
    });

  // Add Y and X axes
  // Add Y axis (without labels)
  svg.append('g')
    .call(d3.axisLeft(yScale).tickFormat('')); // Using tickFormat to hide labels

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // Add attribution line at the bottom
  svg.append('text')
      .attr('x', width - width)
      .attr('y', height + margin.top + 20) // Adjust the y-coordinate for proper placement
      .attr('text-anchor', 'left')
      .style('font-size', '12px')
      .text('Chart created by Luke Schields. Data source: Boston.gov');
});