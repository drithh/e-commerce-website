/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetSales } from '../models/GetSales';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SalesService {

    /**
     * Get Sales
     * @returns GetSales Successful Response
     * @throws ApiError
     */
    public static getSales(): CancelablePromise<GetSales> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1',
        });
    }

}
