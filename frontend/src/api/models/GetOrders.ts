/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Order } from "./Order";
import type { Pagination } from "./Pagination";

export type GetOrders = {
  data: Array<Order>;
  pagination: Pagination;
};
