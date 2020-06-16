import * as d3 from 'd3';

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
