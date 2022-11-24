/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCart } from '../models/CreateCart';
import type { DefaultResponse } from '../models/DefaultResponse';
import type { GetCart } from '../models/GetCart';
import type { UpdateCart } from '../models/UpdateCart';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CartService {
  /**
   * Get Cart
   * @returns GetCart Successful Response
   * @throws ApiError
   */
  public static getCart(): CancelablePromise<GetCart> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/cart',
    });
  }

  /**
   * Update Cart
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static updateCart(
    requestBody: UpdateCart
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/v1/cart',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Cart
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static createCart(
    requestBody: CreateCart
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/v1/cart',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Cart
   * @param id
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static deleteCart(id: string): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/v1/cart',
      query: {
        id: id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Clear Cart
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static clearCart(): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/v1/cart/clear',
    });
  }
}
