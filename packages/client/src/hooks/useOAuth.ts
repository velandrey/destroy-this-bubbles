import { OAuthURL } from '@constants/constants';
import { ROUTES } from '@constants/routes';
import { fetchApi } from '@utils/fetchApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNotification } from './useNotification';
import { useProfile } from './useProfile';

interface ServiceIdResponse {
    service_id: string;
}

export const useOAuth = () => {
    const navigate = useNavigate();
    const { showError, showSuccess } = useNotification();
    const { getUserData } = useProfile();
    const [isLoading, setIsLoading] = useState(false);

    const getRedirectUri = (): string => {
        return window.location.origin;
    };

    // Получаем service id для OAuth
    const getServiceId = async (): Promise<string | null> => {
        try {
            const redirectUri = getRedirectUri();
            const serviceIdResponse = await fetchApi<ServiceIdResponse>(
                `/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(
                    redirectUri
                )}`,
                {
                    method: 'GET',
                }
            );

            if (!serviceIdResponse || typeof serviceIdResponse !== 'object') {
                throw new Error('Invalid service_id response');
            }

            return serviceIdResponse.service_id;
        } catch (error) {
            console.error('Error getting service id:', error);
            showError('Не удалось получить данные для авторизации');
            return null;
        }
    };

    // Инициирование OAuth процесса
    const initiateOAuth = async () => {
        setIsLoading(true);
        try {
            const serviceId = await getServiceId();
            if (!serviceId) {
                throw new Error('Не удалось получить service_id');
            }
            const redirectUri = getRedirectUri();
            // редирект на страницу авторизации Yandex
            window.location.href = `${OAuthURL}/authorize?response_type=code&client_id=${serviceId}&redirect_uri=${encodeURIComponent(
                redirectUri
            )}`;
        } catch (error) {
            showError('Ошибка при инициализации авторизации');
            setIsLoading(false);
        }
    };

    const handleOAuthCallback = async (code: string) => {
        setIsLoading(true);
        try {
            const redirectUri = getRedirectUri();
            // Отправляем код авторизации на сервер
            const result = await fetchApi<string>('/oauth/yandex', {
                method: 'POST',
                data: {
                    code,
                    redirect_uri: redirectUri,
                },
            });
            const responseText = typeof result === 'string' ? result : 'OK';

            if (responseText === 'OK') {
                // Получаем данные пользователя
                await getUserData();
                showSuccess('Успешная авторизация через Yandex');
                navigate(ROUTES.PROFILE);
            } else {
                throw new Error('Ошибка авторизации: ' + responseText);
            }
        } catch (error) {
            console.error('OAuth error:', error);
            showError('Ошибка авторизации через Yandex');
            navigate(ROUTES.LOGIN);
        } finally {
            setIsLoading(false);
        }
    };

    // Проверяем code в URL при загрузке компонента
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            handleOAuthCallback(code);
            // Очищаем URL от code параметра
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            window.history.replaceState({}, document.title, url.toString());
        }
    }, []);

    return {
        initiateOAuth,
        isLoading,
    };
};
