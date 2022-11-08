/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefaultResponse } from '../models/DefaultResponse';
import type { GetCategory } from '../models/GetCategory';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CategoryService {
  /**
   * Get Category
   * @returns GetCategory Successful Response
   * @throws ApiError
   */
  public static getCategory(): CancelablePromise<GetCategory> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/categories',
    });
  }

  /**
   * Update Category
   * @param categoryName
   * @param id
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static updateCategory(
    categoryName: string,
    id: string
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/categories',
      query: {
        category_name: categoryName,
        id: id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Category
   * @param categoryName
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static createCategory(
    categoryName: string
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/categories',
      query: {
        category_name: categoryName,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Category
   * @param id
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static deleteCategory(id: string): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/categories',
      query: {
        id: id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
