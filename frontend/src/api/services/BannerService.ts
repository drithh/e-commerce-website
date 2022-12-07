/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Banner } from '../models/Banner';
import type { CreateBanner } from '../models/CreateBanner';
import type { DefaultResponse } from '../models/DefaultResponse';
import type { GetBanners } from '../models/GetBanners';
import type { UpdateBanner } from '../models/UpdateBanner';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BannerService {
  /**
   * Get Banners
   * @returns GetBanners Successful Response
   * @throws ApiError
   */
  public static getBanners(): CancelablePromise<GetBanners> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/banners',
    });
  }

  /**
   * Update Banner
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static updateBanner(
    requestBody: UpdateBanner
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/v1/banners',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Banner
   * @param requestBody
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static createBanner(
    requestBody: CreateBanner
  ): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/v1/banners',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Banner
   * @param id
   * @returns DefaultResponse Successful Response
   * @throws ApiError
   */
  public static deleteBanner(id: string): CancelablePromise<DefaultResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/v1/banners',
      query: {
        id: id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Banner
   * @param bannerId
   * @returns Banner Successful Response
   * @throws ApiError
   */
  public static getBanner(bannerId: string): CancelablePromise<Banner> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/banners/{banner_id}',
      path: {
        banner_id: bannerId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
