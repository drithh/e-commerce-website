/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetCustomers } from "../models/GetCustomers";
import type { GetOrders } from "../models/GetOrders";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class DashboardService {
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
      method: "GET",
      url: "/api/v1/dashboard/customer",
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
   * @returns GetOrders Successful Response
   * @throws ApiError
   */
  public static getOrder(
    page: number = 1,
    pageSize: number = 25
  ): CancelablePromise<GetOrders> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/dashboard/order",
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
