/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_sign_in_api_v1_sign_in_post } from '../models/Body_sign_in_api_v1_sign_in_post';
import type { ChangePassword } from '../models/ChangePassword';
import type { DefaultResponse } from '../models/DefaultResponse';
import type { ResetPassword } from '../models/ResetPassword';
import type { UserCreate } from '../models/UserCreate';
import type { UserRead } from '../models/UserRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthenticationService {

    /**
     * Sign In
     * @param formData
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static signIn(
        formData: Body_sign_in_api_v1_sign_in_post,
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/sign-in',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Sign Up
     * @param requestBody
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static signUp(
        requestBody: UserCreate,
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/sign-up',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Forgot Password
     * @param email
     * @returns DefaultResponse Successful Response
     * @throws ApiError
     */
    public static forgotPassword(
        email: string,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/forgot-password',
            query: {
                'email': email,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Reset Password
     * @param requestBody
     * @returns DefaultResponse Successful Response
     * @throws ApiError
     */
    public static resetPassword(
        requestBody: ResetPassword,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Change Password
     * @param requestBody
     * @returns DefaultResponse Successful Response
     * @throws ApiError
     */
    public static changePassword(
        requestBody: ChangePassword,
    ): CancelablePromise<DefaultResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
