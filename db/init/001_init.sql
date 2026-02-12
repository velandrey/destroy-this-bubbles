-- Таблица тем сайта (нужна для старта сервера: ensureSiteThemes())
CREATE TABLE IF NOT EXISTS public.site_theme (
  id SERIAL PRIMARY KEY,
  theme VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL
);

-- Стартовые темы (чтобы ensureSiteThemes/findOrCreate не падали)
INSERT INTO public.site_theme (theme, description)
VALUES
  ('light', 'светлая тема'),
  ('dark',  'темная тема')
ON CONFLICT (theme) DO UPDATE
SET description = EXCLUDED.description;

-- Таблица связи пользователя и темы (по вашей модели UserTheme)
CREATE TABLE IF NOT EXISTS public.user_theme (
  user_id INTEGER PRIMARY KEY,
  theme_id INTEGER NULL REFERENCES public.site_theme(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_theme_theme_id ON public.user_theme(theme_id);
