import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { parseDate } from '../store/action';

const width = 1000;
const height = 800;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };
const red = '#0000FF';

const SimpleCategoryInDialog = (props) => {
  const { data, numMax} = props
  const { values } = data
  const [svgPath, setSvgPath] = useState("")

  const xAxisRef = useRef()
  const yAxisRef = useRef()

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
    <div>
      <div className="SVGBlock">
        <svg width={width} height={height}>
          <path d={svgPath} fill='none' stroke={red} strokeWidth='2' />
          <g>
            <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
            <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
          </g>
        </svg>
      </div>
    </div>
  )
}

export default SimpleCategoryInDialog
