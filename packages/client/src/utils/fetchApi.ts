import { ApiURL } from '@constants/constants';

interface FetchOptions extends RequestInit {
    data?: unknown;
    isFormData?: boolean;
}

type ApiResponse<T> = T | string | undefined;

export const fetchApi = async <T>(
    url: string,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
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

    try {
        const response = await fetch(`${ApiURL}${url}`, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            return (await response.json()) as T;
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error(`API request failed: ${url}`, error);
        throw error;
    }
};
