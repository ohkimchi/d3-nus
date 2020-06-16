import { csv } from 'd3-request';
import * as d3 from 'd3';
import { max } from 'd3';
import data from '../web_application_assignment_data.csv';

export const SET_CATEGORY_REVIEW_DATA = 'SET_CATEGORY_REVIEW_DATA';
export const SET_POSITIVE_CATEGORY_REVIEW_DATA = 'SET_POSITIVE_CATEGORY_REVIEW_DATA';
export const SET_NEGATIVE_CATEGORY_REVIEW_DATA = 'SET_NEGATIVE_CATEGORY_REVIEW_DATA';
export const SET_INFLUENCED_DATA = 'SET_INFLUENCED_DATA';
export const SET_MAX_N_CAT_REV = 'SET_MAX_N_CAT_REV';
export const SET_MAX_N_POSITIVE_CAT_REV = 'SET_MAX_N_POSITIVE_CAT_REV';
export const SET_MAX_N_NEGATIVE_CAT_REV = 'SET_MAX_N_NEGATIVE_CAT_REV';
export const SET_MAX_N_INFLUENCED_DATA = 'SET_MAX_N_INFLUENCED_DATA';

export const parseDate = d3.timeParse('%d/%m/%y');

export function sortByDateAscending(a, b) {
  return parseDate(a) - parseDate(b);
}

export function loadCatRevData(dispatch) {
  csv(data, (err, data) => {
    if (err) { throw err; }
    const allCategoriesAndReviewDate = d3.nest()
      .key((d) => d.category).sortKeys(d3.ascending)
      .key((d) => d.review_date)
      .sortKeys(sortByDateAscending)
      .rollup((leaves) => leaves.length)
      .entries(data);

    console.log('allCategoriesAndReviewDate', allCategoriesAndReviewDate);

    const numMax = d3.max(allCategoriesAndReviewDate, (d) => max(d.values.map((x) => x.value)));

    console.log(allCategoriesAndReviewDate);
    dispatch({
      type: SET_CATEGORY_REVIEW_DATA,
      categoryReviewData: allCategoriesAndReviewDate,
      numMaxCatRev: numMax,
    });
  });
}
