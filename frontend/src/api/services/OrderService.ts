/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefaultResponse } from '../models/DefaultResponse';
import type { GetUserOrders } from '../models/GetUserOrders';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrderService {

    /**
     * Get Orders User
     * @returns GetUserOrders Successful Response
     * @throws ApiError
     */
    public static getOrdersUser(): CancelablePromise<GetUserOrders> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/order',
        });
    }

    /**
     * Update Order Status
     * @param orderId
     * @returns DefaultResponse Successful Response
     * @throws ApiError
     */
    public static updateOrderStatus(
        orderId: string,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/order/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Orders
     * @param id
     * @param status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateOrders(
        id: string,
        status: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/orders/{id}',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Orders Admin
     * @param sortBy
     * @param page
     * @param pageSize
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getOrdersAdmin(
        sortBy: string = 'Price a_z',
        page: number = 1,
        pageSize: number = 25,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/orders',
            query: {
                'sort_by': sortBy,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
