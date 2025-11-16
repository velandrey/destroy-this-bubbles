import { fetchApi } from '@utils/fetchApi';
import { TAuthData } from '@pages/login/types';

export async function signIn(
    data: TAuthData,
    opts?: { signal?: AbortSignal }
): Promise<string> {
    const res = await fetchApi<string>('/auth/signin', {
        method: 'POST',
        data: data,
        signal: opts?.signal,
    });
    if (!res || typeof res !== 'string') {
        throw new Error('Invalid data received');
    }
    return res;
}
