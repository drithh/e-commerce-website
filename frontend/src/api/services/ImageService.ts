/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetImage } from '../models/GetImage';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ImageService {

    /**
     * Get Image
     * @param imageName
     * @returns GetImage Successful Response
     * @throws ApiError
     */
    public static getImage(
        imageName: string,
    ): CancelablePromise<GetImage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/image/{image_name}',
            path: {
                'image_name': imageName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
