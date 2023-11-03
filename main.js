const w = 1000;
const h = 600;
const cellpadding = 3;
const marginLeft = 50;


 let svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

 d3.csv('M2dataset.csv').then(function (data) {
     let topData = data.sort((a, b) => parseFloat(b["Relative% Difference T2"]) - parseFloat(a["Relative% Difference T2"])).slice(0, 10);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(topData, d => parseFloat(d["Relative% Difference T2"]))])
        .range([0, h - 100]);  

    let colourScale = d3.scaleLinear()
        .domain([0, d3.max(topData, d => parseFloat(d["Relative% Difference T2"]))])
        .range([255, 0]);

        svg.selectAll("rect")
        .data(topData)
        .enter()
        .append("rect")
        .attr("width", (w - marginLeft) / topData.length - cellpadding)   
        .attr("height", d => yScale(parseFloat(d["Relative% Difference T2"])))
        .attr("x", (d, i) => marginLeft + (w - marginLeft) / topData.length * i)  
        .attr("y", d => h - yScale(parseFloat(d["Relative% Difference T2"])) - 50)
        .attr("fill", d => {
            let f = colourScale(parseFloat(d["Relative% Difference T2"]));
            if (f <= 51)
                return "rgb(" + 255 + ",0,0)";
            else
                return "rgb(" + f + "," + f / (200 / 255) + "," + f + ")";
        });

     svg.selectAll(".labelText")
        .data(topData)
        .enter()
        .append("text")
        .attr("class", "labelText")
        .text(d => d["City, State (largest to smallest 2010-14 RR)"] + " - " + d["Relative% Difference T2"] + "%")
        .attr("x", (d, i) => marginLeft + (w - marginLeft) / topData.length * i + 5)
        .attr("y", d => h - yScale(parseFloat(d["Relative% Difference T2"])) - 55)
        .style("font-size", "12px");

 
     svg.append("text")
        .attr("transform", "translate(" + (w/2) + "," + (h - 10) + ")")
        .style("text-anchor", "middle")
        .text("Cities");

     svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Death Rate Disparity (White vs. Black)");

     svg.append("text")
        .attr("transform", "translate(" + (w/2) + "," + 20 + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Top 10 Cities with Highest Racial Disparity in Breast Cancer Death Rates (2010-2014)");

     let poemText = `
Unequal Care

In Atlanta's heart, a tale unfolds,
About our families and their colds,
For breast cancer rates, a chasm-wide,
Between white and black, a somber divide.

African-American women bear the brunt,
and our prostate cancer death rate is also in front,
For black men, the numbers do tell,
This staggering rate - a living hell.

With 49.7 deaths per hundred grand,
Death's cruel touch, a heavy hand.
But for white men, much less,
It is a terrifying issue we must address

Atlanta should be the city of peaches and coke,
Instead, the land of sickness and stroke.
HIV, cancer, and diabetes too,
The gaps persist, its nothing new.
    `;

    d3.select("body").append("pre").text(poemText);
});
