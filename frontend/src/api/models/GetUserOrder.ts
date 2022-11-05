/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetUserProducts } from './GetUserProducts';

export type GetUserOrder = {
    id: string;
    created_at: string;
    products: Array<GetUserProducts>;
    shipping_method: string;
    status: string;
    shipping_address: string;
};
