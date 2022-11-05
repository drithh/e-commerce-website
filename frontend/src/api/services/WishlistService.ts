/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefaultResponse } from '../models/DefaultResponse';
import type { GetWishlist } from '../models/GetWishlist';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WishlistService {

    /**
     * Get Wishlist
     * @returns GetWishlist Successful Response
     * @throws ApiError
     */
    public static getWishlist(): CancelablePromise<GetWishlist> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/wishlist',
        });
    }

    /**
     * Create Wishlist
     * @param id
     * @returns DefaultResponse Successful Response
     * @throws ApiError
     */
    public static createWishlist(
        id: string,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/wishlist',
            query: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Wishlist
     * @param id
     * @returns DefaultResponse Successful Response
     * @throws ApiError
     */
    public static deleteWishlist(
        id: string,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/wishlist',
            query: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Clear Wishlist
     * @returns DefaultResponse Successful Response
     * @throws ApiError
     */
    public static clearWishlist(): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/wishlist/all',
        });
    }

}
