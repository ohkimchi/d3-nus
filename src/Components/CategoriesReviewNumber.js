import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

const width = 250;
const height = 200;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };
const red = '#eb6a5b';
const blue = '#52b6ca';

let parseDate = d3.timeParse("%d/%m/%y")

const CategoriesReviewNumber = (props) => {
  // console.log('props.data.key', props.data.values)
  const [svgPath, setSvgPath] = useState("")
  const xAxisRef = useRef(null)
  const yAxisRef = useRef(null)
  const { data, numMax } = props
  const { key, values } = data
  console.log(values, numMax)

  let xScale = d3.scaleTime().range([margin.left, width - margin.right])
  let yScale = d3.scaleLinear().range([height - margin.bottom, margin.top])

  let lineGenerator = d3.line()
  let xAxis = d3.axisBottom().scale(xScale)
  let yAxis = d3.axisLeft().scale(yScale);

  useEffect(() => {
    const timeDomain = d3.extent(values, d => parseDate(d.key));
    // const numMax = d3.max(values, d => d.value);
    xScale.domain(timeDomain);
    yScale.domain([0, numMax]);
    lineGenerator.x(d => xScale(parseDate(d.key)));
    lineGenerator.y(d => yScale(d.value));
    const pathSvg = lineGenerator(values)

    setSvgPath(pathSvg)
    d3.select(xAxisRef.current).call(xAxis)
    d3.select(yAxisRef.current).call(yAxis)
  }, [numMax])

  return (
    <svg width={width} height={height}>
      <path d={svgPath} fill='none' stroke={red} strokeWidth='2' />
      <g>
        <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
        <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
      </g>
      <text>{key}</text>
    </svg>

  )
}

export default CategoriesReviewNumber
