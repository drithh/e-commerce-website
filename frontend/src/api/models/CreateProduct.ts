/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateImage } from './CreateImage';

export type CreateProduct = {
    title: string;
    brand: string;
    product_detail: string;
    images: Array<CreateImage>;
    price: number;
    category_id: string;
    condition: string;
};
