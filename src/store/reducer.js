import React, { createContext, useReducer } from 'react';
import {
  SET_CATEGORY_REVIEW_DATA, SET_INFLUENCED_DATA, SET_NEGATIVE_CATEGORY_REVIEW_DATA, SET_POSITIVE_CATEGORY_REVIEW_DATA,
} from './action';

const initialState = {
  categoryReviewData: [],
  positiveCatRevData: [],
  negativeCatRevData: [],
  influencedData: [],
  numMaxCatRev: 0,
  numMaxPosCatRev: 0,
  numMaxNegCatRev: 0,
  numMaxInfluencedData: 0,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_CATEGORY_REVIEW_DATA:
        return {
          ...state,
          categoryReviewData: action.categoryReviewData,
          numMaxCatRev: action.numMaxCatRev,
        };
      case SET_POSITIVE_CATEGORY_REVIEW_DATA:
        return {
          ...state,
          positiveCatRevData: action.positiveCatRevData,
          numMaxPosCatRev: action.numMaxPosCatRev,
        };
      case SET_NEGATIVE_CATEGORY_REVIEW_DATA:
        return {
          ...state,
          negativeCatRevData: action.negativeCatRevData,
          numMaxNegCatRev: action.numMaxNegCatRev,
        };
      case SET_INFLUENCED_DATA:
        return {
          ...state,
          influencedData: action.influencedData,
          numMaxInfluencedData: action.numMaxInfluencedData,
        };
      default:
        return state;
    };
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>
};

export {store, StateProvider}
