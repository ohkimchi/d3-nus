import React from 'react'
import CategoriesReviewNumber from './CategoriesReviewNumber'

const GraphWrapper = (props) => {
  const { dataArray, numMax, keyWord } = props
  return (
    dataArray.map((data, i) =>
      <CategoriesReviewNumber key={`${keyWord}-${i}`} data={data} numMax={numMax} showOutSideBool={true} />)
  )
}

export default GraphWrapper
