/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__schemas__product__GetProduct } from '../models/app__schemas__product__GetProduct';
import type { Body_search_image_api_v1_products_search_image_post } from '../models/Body_search_image_api_v1_products_search_image_post';
import type { Body_search_image_upload_api_v1_products_search_image_upload_post } from '../models/Body_search_image_upload_api_v1_products_search_image_upload_post';
import type { CreateProduct } from '../models/CreateProduct';
import type { DefaultResponse } from '../models/DefaultResponse';
import type { GetProducts } from '../models/GetProducts';
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
     * @returns GetProducts Successful Response
     * @throws ApiError
     */
    public static getProducts(
        category?: Array<string>,
        page: number = 1,
        pageSize: number = 100,
        sortBy: string = 'a_z',
        price?: Array<number>,
        condition: string = '',
        productName: string = '',
    ): CancelablePromise<GetProducts> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/products',
            query: {
                'category': category,
                'page': page,
                'page_size': pageSize,
                'sort_by': sortBy,
                'price': price,
                'condition': condition,
                'product_name': productName,
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
        requestBody: UpdateProduct,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/products',
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
        requestBody: CreateProduct,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/products',
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
        productId: string,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/products/{product_id}',
            path: {
                'product_id': productId,
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
        id: string,
    ): CancelablePromise<app__schemas__product__GetProduct> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/products/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Search Image Upload
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchImageUpload(
        formData: Body_search_image_upload_api_v1_products_search_image_upload_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/products/search_image/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Search Image
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchImage(
        formData: Body_search_image_api_v1_products_search_image_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/products/search_image',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
