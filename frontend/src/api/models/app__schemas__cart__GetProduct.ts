/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetProductDetail } from './GetProductDetail';

export type app__schemas__cart__GetProduct = {
  id: string;
  details: Array<GetProductDetail>;
  price: number;
  image: string;
  name: string;
};
