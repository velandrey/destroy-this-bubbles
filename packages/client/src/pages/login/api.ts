import { YANDEX_DOMAIN } from '../../constants';
export type AuthData = { login: string; password: string };

export async function signIn(
    data: AuthData,
    opts?: { signal?: AbortSignal }
): Promise<{ status: number; body: string | Record<string, string> }> {
    const url = `${YANDEX_DOMAIN}/auth/signin`;

    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        signal: opts?.signal,
    });

    const contentType = res.headers.get('content-type') || '';
    const body = contentType.includes('application/json')
        ? await res.json()
        : await res.text();
    return { status: res.status, body };
}
