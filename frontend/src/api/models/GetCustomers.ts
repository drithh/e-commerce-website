/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Customer } from './Customer';
import type { Pagination } from './Pagination';

export type GetCustomers = {
  data: Array<Customer>;
  pagination: Pagination;
};
