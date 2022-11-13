/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__schemas__user__GetUser } from "../models/app__schemas__user__GetUser";
import type { DefaultResponse } from "../models/DefaultResponse";
import type { DeleteUser } from "../models/DeleteUser";
import type { GetUserAddress } from "../models/GetUserAddress";
import type { GetUserBalance } from "../models/GetUserBalance";
import type { PutUserAddress } from "../models/PutUserAddress";
import type { PutUserBalance } from "../models/PutUserBalance";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class UserService {
  /**
   * Get User
   * @returns app__schemas__user__GetUser Successful Response
   * @throws ApiError
   */
  public static getUser(): CancelablePromise<app__schemas__user__GetUser> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/user",
    });
  }

  /**
   * Update User
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static updateUser(
    requestBody: app__schemas__user__GetUser
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/user",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete User
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public static deleteUser(requestBody: DeleteUser): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/user",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Detail User
   * @param id
   * @returns app__schemas__user__GetUser Successful Response
   * @throws ApiError
   */
  public static getDetailUser(
    id: string
  ): CancelablePromise<app__schemas__user__GetUser> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/user/detail",
      query: {
        id: id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Shipping Address
   * @returns GetUserAddress Successful Response
   * @throws ApiError
   */
  public static getUserShippingAddress(): CancelablePromise<GetUserAddress> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/user/shipping_address",
    });
  }

  /**
   * Put User Shipping Address
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static putUserShippingAddress(
    requestBody: PutUserAddress
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/user/shipping_address",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Balance
   * @returns GetUserBalance Successful Response
   * @throws ApiError
   */
  public static getUserBalance(): CancelablePromise<GetUserBalance> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/user/balance",
    });
  }

  /**
   * Put User Balance
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static putUserBalance(
    requestBody: PutUserBalance
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/user/balance",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
