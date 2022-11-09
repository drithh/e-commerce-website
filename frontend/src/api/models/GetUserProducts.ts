/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetUserProductDetails } from "./GetUserProductDetails";

export type GetUserProducts = {
  id: string;
  details: Array<GetUserProductDetails>;
  price: number;
  image: string;
  name: string;
};
