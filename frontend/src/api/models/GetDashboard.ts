/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CategoryOrder } from "./CategoryOrder";
import type { IncomeMonth } from "./IncomeMonth";

export type GetDashboard = {
  income_per_month: Array<IncomeMonth>;
  total_order_per_category: Array<CategoryOrder>;
};
