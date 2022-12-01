/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__schemas__product__GetProduct } from '../models/app__schemas__product__GetProduct';
import type { app__schemas__product__GetProducts } from '../models/app__schemas__product__GetProducts';
import type { CreateProduct } from '../models/CreateProduct';
import type { DefaultResponse } from '../models/DefaultResponse';
import type { UpdateProduct } from '../models/UpdateProduct';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProductService {
  /**
   * Get Products
   * @param category
   * @param page
   * @param pageSize
   * @param sortBy
   * @param price
   * @param condition
   * @param productName
   * @returns app__schemas__product__GetProducts Successful Response
   * @throws ApiError
   */
  public static getProducts(
    category?: Array<string>,
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'Title a_z',
    price?: Array<number>,
    condition: string = '',
    productName: string = ''
  ): CancelablePromise<app__schemas__product__GetProducts> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/products',
      query: {
        category: category,
        page: page,
        page_size: pageSize,
        sort_by: sortBy,
        price: price,
        condition: condition,
        product_name: productName,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Product
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static updateProduct(
    requestBody: UpdateProduct
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/v1/products',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Product
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static createProduct(
    requestBody: CreateProduct
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/v1/products',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Product
   * @param productId
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static deleteProduct(
    productId: string
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/v1/products',
      query: {
        product_id: productId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Product
   * @param id
   * @returns app__schemas__product__GetProduct Successful Response
   * @throws ApiError
   */
  public static getProduct(
    id: string
  ): CancelablePromise<app__schemas__product__GetProduct> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/products/{id}',
      path: {
        id: id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
