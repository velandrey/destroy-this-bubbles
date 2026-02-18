import { TRegisterData, TRegisterOkResponse } from '@pages/registration/types';
import { fetchApi } from '@utils/fetchApi';

export async function signUp(
    data: TRegisterData,
    opts?: { signal?: AbortSignal }
): Promise<TRegisterOkResponse> {
    const res = await fetchApi<TRegisterOkResponse>('/auth/signup', {
        method: 'POST',
        data: data,
        signal: opts?.signal,
    });
    if (!res || typeof res !== 'object' || !res.id) {
        throw new Error('Invalid data received');
    }
    return res;
}
