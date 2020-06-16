import * as d3 from 'd3';
import { max } from 'd3';
import { csv } from 'd3-request';
import React, { useEffect, useState } from 'react';
import data from '../web_application_assignment_data.csv';

let margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = 350 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

let parseDate = d3.timeParse("%d/%m/%y")

function sortByDateAscending(a, b) {
  return parseDate(a) - parseDate(b)
}
let x = d3.scaleTime().range([0, width])
let y = d3.scaleLinear().range([height, 0])
let color = d3.scaleOrdinal().range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

const PositiveReviewTrend = () => {
  const [positiveReviewCategories, setPositiveReviewCategories] = useState([])
  const [positiveCategoriesReviewData, setPositiveCategoriesReviewData] = useState([])

  useEffect(() => {
    csv(data, (err, data) => {
      if (err) throw err

      let allCategories = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .entries(data.filter(d => d.sentiment === "positive"))
      let allCategoryKeys = allCategories.map(d => d.key)
      console.log("allCategories", allCategories, allCategoryKeys)
      setPositiveReviewCategories(allCategoryKeys)

      let allCategoriesAndReviewDate = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .key(d => d.review_date).sortKeys(sortByDateAscending)
        .rollup(leaves => leaves.length)
        .entries(data)
        // .entries(data.filter(d => d.sentiment === "positive"))
      setPositiveCategoriesReviewData(allCategoriesAndReviewDate)
      console.log("allCategoriesAndReviewDate", allCategoriesAndReviewDate)

      let svg = d3.select("#PositiveReviewTrend")
        .data(allCategoriesAndReviewDate[0].values)
        .append("svg")
        .enter()
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


      x.domain(d3.extent(data, d => parseDate(d.review_date)))
      y.domain([0, d3.max(allCategoriesAndReviewDate, d=>max(d.values.map(x => x.value)))])
      color.domain(allCategoryKeys)


      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(3))

      svg.append("g")
        .call(d3.axisLeft(y).ticks(5));

      // Draw the line
      svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function (d) {
          return color(d.key)
        })
        .attr("stroke-width", 1.9)
        .attr("d", function (d) {
          return d3.line()
            .x(function (d) {
              return x(parseDate(d.key));
            })
            .y(function (d) {
              return y(d.value);
            })
            (allCategoriesAndReviewDate[0].values)
        })

      // Add titles
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(function (d) { return (d.key) })
        .style("fill", function (d) { return color(d.key) })
    })
  }, [])

  return (
    <div>
      Positive review numbers throughout the year 2019
      <div id="PositiveReviewTrend">

      </div>
    </div>

  )
}

export default PositiveReviewTrend
