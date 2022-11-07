/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Stock } from './Stock';

export type app__schemas__product__GetProduct = {
    id: string;
    title: string;
    brand: string;
    product_detail: string;
    images: Array<string>;
    price: number;
    category_id: string;
    category_name: string;
    condition: string;
    size?: Array<string>;
    stock?: Array<Stock>;
};
