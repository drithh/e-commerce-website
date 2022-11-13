/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetUserProducts } from "./GetUserProducts";

export type GetDetailOrder = {
  id: string;
  created_at: string;
  products: Array<GetUserProducts>;
  shipping_method: string;
  shipping_price: number;
  city: string;
  status: string;
  shipping_address: string;
  name: string;
  email: string;
};
