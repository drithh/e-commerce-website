/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetImage } from "../models/GetImage";
import type { SearchText } from "../models/SearchText";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class SearchService {
  /**
   * Get Image
   * @param imageName
   * @returns GetImage Successful Response
   * @throws ApiError
   */
  public static getImage(imageName: string): CancelablePromise<GetImage> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1",
      query: {
        image_name: imageName,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Search Text
   * @param text
   * @returns SearchText Successful Response
   * @throws ApiError
   */
  public static searchText(text: string): CancelablePromise<Array<SearchText>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/search",
      query: {
        text: text,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
