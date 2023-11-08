
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const w = 1000 - margin.left - margin.right;
const h = 800 - margin.top - margin.bottom;
const cellpadding = 3;
const marginLeft = 50;

let topData = [];
let fullData = [];
const circlesData = [
    { cx: 1100, cy: 120, r: 120, color: 'lightpink', opacity: 0.7 },
    { cx: 480, cy: 300, r: 150, color: 'pink', opacity: 0.5 },
    // { cx: 400, cy: 600, r: 175, color: 'lightred', opacity: 0.3 },
    { cx: 400, cy: 800, r: 100, color: 'lightyellow', opacity: 0.7 },
    { cx: 210, cy: 480, r: 120, color: 'lightpink', opacity: 0.7 },
    { cx: 78, cy: 140, r: 150, color: 'pink', opacity: 0.5 },
    // { cx: 740, cy: 100, r: 175, color: 'lightred', opacity: 0.3 },
    { cx: 780, cy: 499, r: 100, color: 'lightgrey', opacity: 0.7 },

    { cx: 300, cy: 650, r: 120, color: 'lightpink', opacity: 0.7 },
    { cx: 1280, cy: 400, r: 150, color: 'pink', opacity: 0.5 },
    // { cx: 600, cy: 550, r: 175, color: 'lightred', opacity: 0.3 },
    { cx: 1000, cy: 400, r: 100, color: 'lightyellow', opacity: 0.7 },
    { cx: 620, cy: 780, r: 120, color: 'lightpink', opacity: 0.7 },
    { cx: 1100, cy: 700, r: 150, color: 'pink', opacity: 0.5 },
    // { cx: 600, cy: 580, r: 175, color: 'lightred', opacity: 0.3 },
     
  ];

let yScale = d3.scaleLinear()
    .range([h - 100, 0]);
    
const maxDataValue = d3.max(topData, d => parseFloat(d["Relative% Difference T2"]));
const padding = 0.1;  
yScale.domain([0, maxDataValue + maxDataValue * padding]);

const yAxis = d3.axisLeft(yScale);
let fullPageSvg = d3.select("body").insert("svg", ":first-child")  
    .attr("width", "100%")
    .attr("height", "100%")
    .style("position", "fixed")  
    .style("top", 0)
    .style("left", 0)
    .style("z-index", "-1") 
    .style("pointer-events", "none");  

 fullPageSvg.selectAll('circle')
    .data(circlesData)
    .enter()
    .append('circle')
    .attr('cx', d => d.cx)
    .attr('cy', d => d.cy)
    .attr('r', d => d.r)
    .style('fill', d => d.color)
    .style('opacity', d => d.opacity);
 

 let svg = d3.select(".content-container").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 let yAxisGroup = svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${marginLeft}, 0)`);

 let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let colourScale; 

//to load dataset 
d3.csv('M2dataset.csv').then(function (data) {
    topData = data.sort((a, b) => parseFloat(b["Relative% Difference T2"]) - parseFloat(a["Relative% Difference T2"])).slice(0, 10);
    fullData = data;
 colourScale = d3.scaleLinear()
    .domain([0, 100])
    .range(["lightgreen", "lightcoral"]);

     yScale.domain([0, d3.max(topData, d => parseFloat(d["Relative% Difference T2"]))]);

     updateChart(topData);
 
    svg.append("text")
        .attr("transform", "translate(" + (w/2) + "," + (h - 10) + ")")
        .style("text-anchor", "middle")
        .text("Cities");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0  - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Death Rate Disparity (White vs. Black)");

        svg.append("text")
        .attr("class", "chart-title text-element")
        .attr("transform", "translate(" + (w / 2) + "," + (-margin.top / 2) + ")") // Adjust this line
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Top 10 Cities with Highest Racial Disparity in Breast Cancer Death Rates (2010-2014)");
    
     let poemText = `
    <strong class="poem-title">Unequal Care</strong>
     
    
    In Atlanta's heart, a tale unfolds,
    About our families and their colds,
    For breast cancer rates, a chasm-wide,
    Between white and black, a somber divide.
    
    African-American women bear the brunt,
    And our prostate cancer death rate is also in front,
    For black men, the numbers do tell,
    This staggering rate - a living hell.
    
    With 49.7 deaths per hundred grand,
    Death's cruel touch, a heavy hand.
    But for white men, much less,
    It is a terrifying issue we must address
    
    Atlanta should be the city of peaches and coke,
    Instead, the land of sickness and stroke.
    HIV, cancer, and diabetes too,
    The gaps persist, it's nothing new.
    `;
    
     d3.select("body").append("div")
      .classed("poem", true)
      .selectAll("p")
      .data(poemText.split("\n\n"))  
      .enter()
      .append("p")  
      //need to replace ln with br
      .html(d => d.replace(/\n/g, '<br>'))  
      .classed("stanza", true);
     
 
 
svg.selectAll("circle").lower();


    });

      
d3.selectAll("input[type=checkbox]").on("change", function() {
    let checkedRegions = d3.selectAll("input[type=checkbox]:checked").nodes()
        .map(d => d.value);
    

  
        let regionData = [];
   
        checkedRegions.forEach(region => {
          let regionCities = fullData
            .filter(d => getRegion(d["City, State (largest to smallest 2010-14 RR)"]) === region);
          regionData = regionData.concat(regionCities);
        });
       
        let uniqueData = [...new Map(regionData.map(item => [item["City, State (largest to smallest 2010-14 RR)"], item])).values()];
        
        let filteredData = uniqueData.sort((a, b) => parseFloat(b["Relative% Difference T2"]) - parseFloat(a["Relative% Difference T2"])).slice(0, 10);
      
         updateChart(filteredData);
         
});


 function updateTitle(data, checkedRegions) {
     let cityCount = data.length; // number of cities currently displayed
    let titleBase = `Top ${cityCount} Cities with Highest Racial Disparity in Breast Cancer Death Rates (2010-2014)`;
     let title = checkedRegions.length === 0 ? `${titleBase} In the US` : titleBase;
    svg.select(".chart-title").text(title);
}

 d3.selectAll("input[type=checkbox]").on("change", updateFilteredData);

 function updateFilteredData() {
    let checkedRegions = d3.selectAll("input[type=checkbox]:checked").nodes()
        .map(d => d.value);

    if (checkedRegions.length === 0) {
         updateChart(topData.slice(0, 10));  
    } else {
        let regionData = [];

         checkedRegions.forEach(region => {
            let regionCities = fullData
                .filter(d => getRegion(d["City, State (largest to smallest 2010-14 RR)"]) === region);
            regionData = regionData.concat(regionCities);
        });

         let uniqueData = [...new Map(regionData.map(item => [item["City, State (largest to smallest 2010-14 RR)"], item])).values()];
        let filteredData = uniqueData.sort((a, b) => parseFloat(b["Relative% Difference T2"]) - parseFloat(a["Relative% Difference T2"])).slice(0, 10);

         updateChart(filteredData);
    }
     updateTitle(checkedRegions);
}

 function updateChart(data) {
     data.sort((a, b) => parseFloat(b["Relative% Difference T2"]) - parseFloat(a["Relative% Difference T2"]));

    
    svg.style("display", "block");
    

     yScale.domain([0, d3.max(data, d => parseFloat(d["Relative% Difference T2"])) * 1.1]);


     yAxisGroup.transition().duration(750).call(yAxis);

     let barGroups = svg.selectAll(".bar-group")
        .data(data, d => d["City, State (largest to smallest 2010-14 RR)"]);

     barGroups.exit().remove();

     let enterBarGroups = barGroups.enter()
        .append("g")
        .attr("class", "bar-group");

     enterBarGroups.append("rect")
        .attr("class", "bar")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

     enterBarGroups.append("text")
        .attr("class", "city-label")
        .attr("text-anchor", "middle")
        .style("fill-opacity", 1)  
        .attr("dy", "1em"); 

     barGroups = enterBarGroups.merge(barGroups);

     barGroups.select(".bar")
        .transition().duration(750)
        .attr("x", (d, i) => marginLeft + i * ((w - marginLeft) / data.length))
        .attr("y", d => yScale(parseFloat(d["Relative% Difference T2"])))
        .attr("width", (w - marginLeft) / data.length - cellpadding)
        .attr("height", d => h - 100 - yScale(parseFloat(d["Relative% Difference T2"])))
        .attr("fill", d => colourScale(parseFloat(d["Relative% Difference T2"])));

     
    barGroups.select(".city-label")
    .transition().duration(750)
    .attr("x", (d, i) => marginLeft + (i + 0.5) * ((w - marginLeft) / data.length)) // Center the label
    .attr("y", d => yScale(parseFloat(d["Relative% Difference T2"])) - 40) // Position just above the bar
    .text(d => d["City, State (largest to smallest 2010-14 RR)"].split(",")[0]); // Show city name

      svg.selectAll(".percent-label").remove();

     barGroups.append("text")
        .attr("class", "percent-label")
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => marginLeft + (i + 0.5) * ((w - marginLeft) / data.length))
        .attr("y", d => yScale(parseFloat(d["Relative% Difference T2"])) - 5)
        .text(d => `${d["Relative% Difference T2"]}%`)
        .style("fill-opacity", 0);  


        
        
     function handleMouseOver(event, d) {
         d3.select(this.parentNode).select(".percent-label").transition().style("fill-opacity", 1);
         tooltip.html(`${d["Relative% Difference T2"]}%`)
               .style("left", (event.pageX) + "px")
               .style("top", (event.pageY - 28) + "px")
               .style("opacity", 1);
    }
    //mouse out
     function handleMouseOut(event, d) {
         d3.select(this.parentNode).select(".percent-label").transition().style("fill-opacity", 0);
         tooltip.style("opacity", 0);
    }
    updateTitle(data, d3.selectAll("input[type=checkbox]:checked").nodes().map(d => d.value));
}
updateFilteredData();
 function getRegion(cityState) {
     const stateAbbrev = cityState.split(", ")[1];
    //only considers state abbreviation
     const newEnglandStates = ["CT", "ME", "MA", "NH", "RI", "VT"];
    const middleAtlanticStates = ["NJ", "NY", "PA"];
    const eastNorthCentralStates = ["IN", "IL", "MI", "OH", "WI"];
    const westNorthCentralStates = ["IA", "KS", "MN", "MO", "NE", "ND", "SD"];
    const southAtlanticStates = ["DE", "DC", "FL", "GA", "MD", "NC", "SC", "VA", "WV"];
    const eastSouthCentralStates = ["AL", "KY", "MS", "TN"];
    const westSouthCentralStates = ["AR", "LA", "OK", "TX"];
    const mountainStates = ["AZ", "CO", "ID", "NM", "MT", "UT", "NV", "WY"];
    const pacificStates = ["AK", "CA", "HI", "OR", "WA"];

     if (newEnglandStates.includes(stateAbbrev)) return "Northeast";
    if (middleAtlanticStates.includes(stateAbbrev)) return "Northeast";
    if (eastNorthCentralStates.includes(stateAbbrev)) return "Midwest";
    if (westNorthCentralStates.includes(stateAbbrev)) return "Midwest";
    if (southAtlanticStates.includes(stateAbbrev)) return "South";
    if (eastSouthCentralStates.includes(stateAbbrev)) return "South";
    if (westSouthCentralStates.includes(stateAbbrev)) return "South";
    if (mountainStates.includes(stateAbbrev)) return "West";
    if (pacificStates.includes(stateAbbrev)) return "West";

    return "Other";  //default case
}
