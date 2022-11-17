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
      url: '/api/v1/cart',
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
      url: '/api/v1/cart',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
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
      url: '/api/v1/cart/{cart_id}',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Cart
   * @param cartId
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static deleteCart(cartId: string): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/cart/{cart_id}',
      path: {
        cart_id: cartId,
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
      url: '/api/v1/cart/clear',
    });
  }
}
