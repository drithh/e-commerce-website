/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Product } from './Product';

export type GetProducts = {
    data: Array<Product>;
    total_rows: number;
};