import * as d3 from 'd3';
import { max } from 'd3';
import { csv } from 'd3-request';
import React, { useEffect, useState } from 'react';
import CategoriesReviewNumber from './Components/CategoriesReviewNumber';
import data from './web_application_assignment_data.csv';

let parseDate = d3.timeParse("%d/%m/%y")

function sortByDateAscending(a, b) {
  return parseDate(a) - parseDate(b)
}
const App = () => {
  const [categories, setCategories] = useState([])
  const [categoriesReviewData, setCategoriesReviewData] = useState([])
  const [numMaxCatRev, setNumMaxCatRev] = useState(0)
  const [positiveCatRev, setPositiveCatRev] = useState([])
  const [numMaxPosCatRev, setNumMaxPosCatRev] = useState(0)

  useEffect(() => {
    csv(data, (err, data) => {
      if (err) throw err

      let allCategories = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .entries(data)
      let allCategoryKeys = allCategories.map(d => d.key)
      console.log("allCategories", allCategoryKeys)
      setCategories(allCategoryKeys)

      let allCategoriesAndReviewDate = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .key(d => d.review_date).sortKeys(sortByDateAscending)
        .rollup(leaves => leaves.length)
        .entries(data)

      setCategoriesReviewData(allCategoriesAndReviewDate)
      console.log("allCategoriesAndReviewDate", allCategoriesAndReviewDate)

      let numMax = d3.max(allCategoriesAndReviewDate, d => max(d.values.map(x => x.value)))
      setNumMaxCatRev(numMax)

      let allPositiveReviews = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .key(d => d.review_date).sortKeys(sortByDateAscending)
        .rollup(leaves => leaves.length)
      .entries(data.filter(d => d.sentiment === "positive"))
      setPositiveCatRev(allPositiveReviews)
      let numMaxPosCatRev = d3.max(allPositiveReviews, d => max(d.values.map(x => x.value)))
      setNumMaxPosCatRev(numMaxPosCatRev)
    })
  }, [])
  return (
    <div className="App">
      <div>
        <h1>Categories and Review Number</h1>
      {
          categoriesReviewData.map((data, i) =>
            <CategoriesReviewNumber key={`categoriy-${i}`} data={data} numMax={numMaxCatRev} />)
        }
      </div>
      <div>
        <h1>Positive Reviews</h1>
        {
          positiveCatRev.map((data, i) =>
            <CategoriesReviewNumber key={`positive-${i}`} data={data} numMax={numMaxPosCatRev} />)
        }
</div>
    </div>
  )
}

export default App;
