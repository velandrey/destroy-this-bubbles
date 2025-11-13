import './client.d';

export const SERVER_HOST =
    typeof window === 'undefined'
        ? __INTERNAL_SERVER_URL__
        : __EXTERNAL_SERVER_URL__;

export const GAME_DESCRIPTION = {
    name: 'Destroy This Bubbles',
    rules: [
        'Щёлкните по пузырям, чтобы уничтожить их',
        'Чем больше пузырей уничтожаете, тем больше очков вы получаете',
        'За пропущенные пузыри вы теряете очки',
    ],
};
