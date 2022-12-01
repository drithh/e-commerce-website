/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__schemas__admin__GetOrders } from '../models/app__schemas__admin__GetOrders';
import type { GetCustomers } from '../models/GetCustomers';
import type { GetDashboard } from '../models/GetDashboard';
import type { GetSales } from '../models/GetSales';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DashboardService {
  /**
   * Get Sales
   * @returns GetSales Successful Response
   * @throws ApiError
   */
  public static getSales(): CancelablePromise<GetSales> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/admin/sales',
    });
  }

  /**
   * Get Dashboard
   * @returns GetDashboard Successful Response
   * @throws ApiError
   */
  public static getDashboard(): CancelablePromise<GetDashboard> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/admin/dashboard',
    });
  }

  /**
   * Get Customer
   * @param page
   * @param pageSize
   * @returns GetCustomers Successful Response
   * @throws ApiError
   */
  public static getCustomer(
    page: number = 1,
    pageSize: number = 25
  ): CancelablePromise<GetCustomers> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/admin/customer',
      query: {
        page: page,
        page_size: pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Order
   * @param page
   * @param pageSize
   * @returns app__schemas__admin__GetOrders Successful Response
   * @throws ApiError
   */
  public static getOrder(
    page: number = 1,
    pageSize: number = 25
  ): CancelablePromise<app__schemas__admin__GetOrders> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/admin/order',
      query: {
        page: page,
        page_size: pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
