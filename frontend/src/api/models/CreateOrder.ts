/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderAddress } from './OrderAddress';

export type CreateOrder = {
  shipping_method?: string;
  shipping_address: OrderAddress;
  send_email?: boolean;
};
