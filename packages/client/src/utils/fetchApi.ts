import { ApiURL } from '@constants/constants';

export class ApiError<T = unknown> extends Error {
    status: number;
    data?: T;

    constructor(status: number, message: string, data?: T) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

interface FetchOptions extends RequestInit {
    data?: unknown;
    isFormData?: boolean;
}

type TApiResponse<T> = T | string | undefined;

export const fetchApi = async <T>(
    url: string,
    options: FetchOptions = {}
): Promise<TApiResponse<T>> => {
    const {
        method = 'GET',
        data,
        isFormData = false,
        headers = {},
        ...restOptions
    } = options;

    const config: RequestInit = {
        method,
        headers: {
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            Accept: 'application/json',
            ...headers,
        },
        mode: 'cors',
        credentials: 'include',
        ...restOptions,
    };

    if (data) {
        config.body = isFormData ? (data as BodyInit) : JSON.stringify(data);
    }

    const response = await fetch(`${ApiURL}${url}`, config);

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    const responseData = isJson
        ? await response.json().catch(() => undefined)
        : await response.text().catch(() => undefined);

    if (!response.ok) {
        throw new ApiError(
            response.status,
            `HTTP error ${response.status}`,
            responseData
        );
    }

    return responseData as T;
};
