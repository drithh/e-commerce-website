/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Order } from './Order';
import type { Pagination } from './Pagination';

export type app__schemas__admin__GetOrders = {
  data: Array<Order>;
  pagination: Pagination;
};
