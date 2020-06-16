import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

const width = 500;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };
const red = '#eb6a5b';

let parseDate = d3.timeParse("%d/%m/%y")

const CategoriesReviewNumber = (props) => {
  const [svgPath, setSvgPath] = useState("")

  const xAxisRef = useRef()
  const yAxisRef = useRef()
  const { data, numMax } = props
  const { key, values } = data

  let xScale = d3.scaleTime().range([margin.left, width - margin.right])
  let yScale = d3.scaleLinear().range([height - margin.bottom, margin.top])

  let lineGenerator = d3.line()
  let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%b'))
  let yAxis = d3.axisLeft().scale(yScale);

  useEffect(() => {
    const timeDomain = d3.extent(values, d => parseDate(d.key));
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
    <div className="SVGBlock">
      <h5>{key}</h5>
      <svg width={width} height={height}>
        <path d={svgPath} fill='none' stroke={red} strokeWidth='2' />
        <g>
          <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
          <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    </div>


  )
}

export default CategoriesReviewNumber
