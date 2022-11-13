/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetImage } from "../models/GetImage";
import type { SearchImage } from "../models/SearchImage";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class ImageService {
  /**
   * Get Image
   * @param imageName
   * @returns GetImage Successful Response
   * @throws ApiError
   */
  public static getImage(imageName: string): CancelablePromise<GetImage> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/image/{image_name}",
      path: {
        image_name: imageName,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Search Image
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static searchImage(requestBody: SearchImage): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/image/search_image",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
