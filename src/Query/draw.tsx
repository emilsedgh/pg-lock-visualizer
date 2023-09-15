// @ts-nocheck

import * as d3 from "d3";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);


export default function draw(container: SVGElement, {query, roots, parents, children}: {query: Query, parents: {}, children: {}}) {
  // Declare the chart dimensions and margins.
  const width = window.screen.availWidth - 100;
  const height = 800;

}