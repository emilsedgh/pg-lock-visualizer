import * as d3 from "d3";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function draw(container, {fromTime, toTime, roots, setSelectedQuery}) {
  // Declare the chart dimensions and margins.
  const width = window.screen.availWidth - 100;
  const height = 500;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const maxChildren = roots.reduce((acc, cur) => {
    if (cur.total_block_count > acc)
        return cur.total_block_count
    return acc
    }, 0)

  // const minTime = roots.reduce((acc, cur) => {
  //   console.log('cur.started_at', cur.started_at)
  //   if (new Date(cur.started_at) < acc)
  //       return new Date(cur.started_at)
  //   return acc
  //   }, fromTime?.toDate() ?? new Date)
    
    const minTime = fromTime?.toDate()

  // Declare the x (horizontal position) scale.
  const x = d3.scaleTime()
      .domain([minTime, toTime?.toDate() ?? dayjs.utc().toDate()])
      .range([marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
      .domain([0, maxChildren])
      .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3.select(container)
      .attr("width", width)
      .attr("height", height)

  // Add the x-axis.
  
  
  const xAxis = d3.axisBottom(x)
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  // Add the y-axis.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));

    const scaleOpacity = d3.scaleLinear().domain([0, maxChildren]).range([0.1, 1])

  svg.append("g")
    .selectAll("circle")
    .data(roots)
    .join("circle")
      .attr("cx", d => {
        return x(dayjs.utc(d.started_at).toDate())
      })
      .attr("cy", d => y(d.total_block_count))
      .attr("r", 10)
      .attr("fill", "red")
      .attr("opacity", "0.05")
      .on("click", (event, d) => {
        setSelectedQuery(d)
      })

    // svg.append("g")
    //     .attr("stroke", "orange")
    //     .attr("stroke-width", 2)
    //     .selectAll("line")
    //     .data(roots)
    //     .join("line")
    //     .attr("x1", d => x(dayjs.utc(d.started_at).toDate()))
    //     .attr("x2", d => x(new Date(d.ended_at) ?? new Date()))
    //     .attr("y1", d => y(d.total_block_count))
    //     .attr("y2", d => y(d.total_block_count))


}