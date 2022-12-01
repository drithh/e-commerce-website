/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { app__schemas__user__GetProducts } from './app__schemas__user__GetProducts';

export type GetOrder = {
  id: string;
  created_at: string;
  products: Array<app__schemas__user__GetProducts>;
  shipping_method: string;
  shipping_price: number;
  city: string;
  status: string;
  shipping_address: string;
};
