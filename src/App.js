import * as d3 from 'd3';
import { max } from 'd3';
import { csv } from 'd3-request';
import React, { useEffect, useState } from 'react';
import "./App.css";
import CategoriesReviewNumber from './Components/CategoriesReviewNumber';
import { sortByDateAscending } from './store/action';
import data from './web_application_assignment_data.csv';

const App = () => {
  // const [categories, setCategories] = useState([])
  const [categoriesReviewData, setCategoriesReviewData] = useState([])
  const [numMaxCatRev, setNumMaxCatRev] = useState(0)
  const [positiveCatRev, setPositiveCatRev] = useState([])
  const [numMaxPosCatRev, setNumMaxPosCatRev] = useState(0)
  const [negativeCatRev, setNegativeCatRev] = useState([])
  const [numMaxNegCatRev, setNumMaxNegCatRev] = useState(0)
  const [influencedRev, setInfluencedRev] = useState([])
  const [numMaxInfluenced, setNumMaxInfluenced] = useState(0)

  useEffect(() => {
    csv(data, (err, data) => {
      if (err) throw err

      // let allCategories = d3.nest()
      //   .key(d => d.category).sortKeys(d3.ascending)
      //   .entries(data)
      // let allCategoryKeys = allCategories.map(d => d.key)
      // console.log("allCategories", allCategoryKeys)
      // setCategories(allCategoryKeys)

      let allCategoriesAndReviewDate = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .key(d => d.review_date).sortKeys(sortByDateAscending)
        .rollup(leaves => leaves.length)
        .entries(data)

      setCategoriesReviewData(allCategoriesAndReviewDate)
      console.log("allCategoriesAndReviewDate", allCategoriesAndReviewDate)

      let numMax = d3.max(allCategoriesAndReviewDate, d => max(d.values.map(x => x.value)))
      setNumMaxCatRev(numMax)
      console.log(allCategoriesAndReviewDate)

      let allPositiveReviews = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .key(d => d.review_date).sortKeys(sortByDateAscending)
        .rollup(leaves => leaves.length)
        .entries(data.filter(d => d.sentiment === "positive"))
      setPositiveCatRev(allPositiveReviews)
      let numMaxPosCatRev = d3.max(allPositiveReviews, d => max(d.values.map(x => x.value)))
      setNumMaxPosCatRev(numMaxPosCatRev)

      let allNegativeReviews = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .key(d => d.review_date).sortKeys(sortByDateAscending)
        .rollup(leaves => leaves.length)
        .entries(data.filter(d => d.sentiment === "negative"))
      setNegativeCatRev(allNegativeReviews)
      let numMaxNeg = d3.max(allNegativeReviews, d => max(d.values.map(x => x.value)))
      setNumMaxNegCatRev(numMaxNeg)

      let allInfluencedYes = d3.nest()
        .key(d => d.category).sortKeys(d3.ascending)
        .key(d => d.review_date).sortKeys(sortByDateAscending)
        .rollup(leaves => leaves.length)
        .entries(data.filter(d => d.is_influenced === "Yes"))
      setInfluencedRev(allInfluencedYes)
      let numMaxInf = d3.max(allInfluencedYes, d => max(d.values.map(x => x.value)))
      setNumMaxInfluenced(numMaxInf)
    })
  }, [numMaxCatRev, numMaxPosCatRev, numMaxNegCatRev, numMaxInfluenced])

  return (
    <div className="App">
      {
        numMaxCatRev !== 0 && numMaxPosCatRev !== 0 && numMaxNegCatRev !== 0 && numMaxInfluenced !== 0 ?
          (<div>
            <div>
              <h1>Categories and Review Number</h1>
              <div className="graphRow">
                {
                  categoriesReviewData.map((data, i) =>
                    <CategoriesReviewNumber key={`categoriy-${i}`} data={data} numMax={numMaxCatRev} />)
                }
              </div>

            </div>
            <div>
              <h1>Positive Reviews</h1>
              <div className="graphRow">
                {
                  positiveCatRev.map((data, i) =>
                    <CategoriesReviewNumber key={`positive-${i}`} data={data} numMax={numMaxPosCatRev} />)
                }
              </div>
            </div>
            <div>
              <h1>Negative Reviews</h1>
              <div className="graphRow">
                {
                  negativeCatRev.map((data, i) =>
                    <CategoriesReviewNumber key={`negative-${i}`} data={data} numMax={numMaxNegCatRev} />
                  )
                }
              </div>

            </div>
            <div>
              <h1>Influenced Reviews</h1>
              <div className="graphRow">
                {
                  influencedRev.map((data, i) =>
                    <CategoriesReviewNumber key={`influenced-${i}`} data={data} numMax={numMaxInfluenced} />)
                }
              </div>
            </div>
          </div>)
          : (<div>
            <h1>Loading Data from CSV...</h1>
          </div>)
      }


    </div>
  )
}

export default App;
