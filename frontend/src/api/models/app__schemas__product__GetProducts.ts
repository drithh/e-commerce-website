/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Pagination } from './Pagination';
import type { Product } from './Product';

export type app__schemas__product__GetProducts = {
  data: Array<Product>;
  total_rows: number;
  pagination: Pagination;
};
