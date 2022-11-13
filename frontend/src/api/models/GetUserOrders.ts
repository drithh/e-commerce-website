/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetUserOrder } from "./GetUserOrder";
import type { Pagination } from "./Pagination";

export type GetUserOrders = {
  data: Array<GetUserOrder>;
  pagination: Pagination;
};
