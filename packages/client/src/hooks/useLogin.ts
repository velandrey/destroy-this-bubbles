import { useApi } from '@hooks/useApi';
import { AuthData } from '@pages/login/types';

export async function signIn(
    data: AuthData,
    opts?: { signal?: AbortSignal }
): Promise<string> {
    const res = await useApi<string>('/auth/signin', {
        method: 'POST',
        data: data,
        signal: opts?.signal,
    });
    if (!res || typeof res !== 'string') {
        throw new Error('Invalid data received');
    }
    return res;
}
