import * as d3 from 'd3';
import { max, line } from 'd3';
import { csv } from 'd3-request';
import React, { useEffect, useState } from 'react';
import data from '../web_application_assignment_data.csv';

let margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

let xScale = d3.scaleTime().range([margin.left, width - margin.right])
let yScale = d3.scaleLinear().range([0, width / 2])
let lineGenerator = d3.line()
let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%b"))
let yAxis = d3.axisLeft().scale(yScale)

const SVG = () => {
  const [categories, setCategories] = useState([])
  const [categoriesReviewData, setCategoriesReviewData] = useState("")

  useEffect(() => {
    csv(data, (err, data) => {
      if (err) throw err
      let parseDate = d3.timeParse("%d/%m/%y")

      let allCategories = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .entries(data)
      let allCategoryKeys = allCategories.map(d => d.key)
      console.log("allCategories", allCategoryKeys)
      setCategories(allCategoryKeys)

      function sortByDateAscending(a, b) {
        return parseDate(a) - parseDate(b)
      }
      let allCategoriesAndReviewDate = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .key(d => d.review_date).sortKeys(sortByDateAscending)
        .rollup(leaves => leaves.length)
        .entries(data)
      setCategoriesReviewData(allCategoriesAndReviewDate)
      console.log("allCategoriesAndReviewDate", allCategoriesAndReviewDate)

      let timeDomain = d3.extent(data, d => parseDate(d.review_date))
      let numberMax = d3.max(allCategoriesAndReviewDate, d => max(d.values.map(x => x.value)))
      xScale.domain(timeDomain)
      yScale.domain([numberMax,0])
      lineGenerator.x(d => xScale(parseDate(d.key)))
      lineGenerator.y(d => yScale(d.value))
      const processedData = lineGenerator(allCategoriesAndReviewDate[0].values)
      // console.log(processedData, typeof processedData)
      console.log(allCategoriesAndReviewDate[0].values)
      setCategoriesReviewData(processedData)
    })
  }, [])

  return (
    <div>
      Review numbers throughout the year 2019
      <div id="Dashboard">
        <svg width={width} height={height}>
          <path d={categoriesReviewData} fill="tick" stroke="red" />
        </svg>
      </div>
    </div>

  )
}

export default SVG
