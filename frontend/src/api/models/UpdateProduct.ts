/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UpdateImage } from "./UpdateImage";

export type UpdateProduct = {
  id: string;
  title: string;
  brand: string;
  product_detail: string;
  images: Array<UpdateImage>;
  price: number;
  category_id: string;
  condition: string;
};
