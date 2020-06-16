import React, { useContext, useEffect } from 'react';
import temp from './temp.json';
import { store } from '../store/reducer';
import CategoriesReviewNumber from './CategoriesReviewNumber';

const Popup = () => {
  const state = useContext(store)
  const { dispatch } = state
  const { categoryReviewData, numMaxCatRev } = state

  useEffect(() => {
    console.log(categoryReviewData)
  }, [categoryReviewData])

  return (
    <div>
      {
        categoryReviewData.map((data, i) => <CategoriesReviewNumber key={`categoriy-${i}`} data={data} numMax={numMaxCatRev} />)
      }
    </div>
  )

};

export default Popup;
