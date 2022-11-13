/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UpdateStock } from "./UpdateStock";

export type UpdateProduct = {
  id: string;
  title: string;
  brand: string;
  product_detail: string;
  images: Array<string>;
  price: number;
  category_id: string;
  condition: string;
  stock: Array<UpdateStock>;
};
