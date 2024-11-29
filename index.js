/** @format */

const edu = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")

const areas = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")

const w = 1000;
const h = 800;

const container = d3
  .select("body")
  .append("div")
  .attr("class", "container")
  .attr("width", w)
  .attr("height", h);

container
  .append("h1")
  .text("United States Educational Attainment")
  .attr("id", "title");

container
  .append("p")
  .attr("id", "description")
  .text(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  );

const svg = container
  .append("svg")
  .attr("class", "svg")
  .attr("width", w - 20)
  .attr("height", h);

const path = d3.geoPath();

svg
  .append("g")
  .selectAll("path")
  .data(topojson.feature(areas, areas.objects.states).features)
  .join("path")
  .attr("d", (d) => path(d))
  .attr("y", 40);

const counties = svg
  .append("g")
  .attr("fill", "#fff")
  .selectAll("path")
  .data(topojson.feature(areas, areas.objects.counties).features)
  .enter()
  .append("path")
  .attr("d", path)
  .attr("class", "county")
  .style("fill", function (d) {
    let [val] = edu.filter((e) => e.fips === d.id);
    val = val.bachelorsOrHigher;
    let color = "red";
    if (val > 20) color = "orange";
    if (val > 40) color = "yellow";
    if (val > 60) color = "green";
    return color;
  })
  .attr("data-fips", (d) => d.id)
  .attr("data-education", (d) => {
    const [val] = edu.filter((e) => e.fips === d.id);
    return val.bachelorsOrHigher;
  })

  .on("mouseenter", (e, d) => {
    tooltip.classed("hidden", false);
    const { x, y } = e.target.getBoundingClientRect();
    const [val] = edu.filter((e) => e.fips === d.id);
    return tooltip
      .attr("data-education", e.target.dataset.education)
      .style("transform", "translate(" + x + "px," + y + "px)")
      .text(`${e.target.dataset.education}%, ${val.state}, ${val.area_name}`);
  })
  .on("mouseleave", (e) => tooltip.classed("hidden", true));

counties
  .selectAll("path")
  .append("title")
  .text(() => {
    return `${d.state}, ${d.area_name} - ${d.bachelorsOrHigher}%`;
  })
  .join("path")
  .attr("d", path)
  .attr("y", 40);

const tooltip = container
  .append("div")
  .attr("id", "tooltip")
  .attr("class", "hidden");

const legend = svg.append("g").attr("id", "legend");

const eduScale = edu.filter((e) => e.bachelorsOrHigher > 75);

const min = d3.min(eduScale);
const max = d3.max(eduScale);

legend
  .append("rect")
  .attr("width", 100)
  .attr("height", 10)
  .attr("fill", "red")
  .attr("x", 20)
  .attr("y", 610);

legend
  .append("rect")
  .attr("width", 100)
  .attr("height", 10)
  .attr("fill", "orange")
  .attr("x", 120)
  .attr("y", 610);

legend
  .append("rect")
  .attr("width", 100)
  .attr("height", 10)
  .attr("fill", "yellow")
  .attr("x", 220)
  .attr("y", 610);

legend
  .append("rect")
  .attr("width", 100)
  .attr("height", 10)
  .attr("fill", "green")
  .attr("x", 320)
  .attr("y", 610);

let scale = d3.scaleLinear().domain([0, 80]).range([20, 420]);

let axis = d3.axisBottom(scale).tickValues([0, 20, 40, 60, 80]);

legend.append("g").attr("transform", `translate(0, 620)`).call(axis);
