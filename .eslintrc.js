module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  rules: {
    // Отключаем конфликтующие правила, чтобы работал плагин
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    // Кастомное правило из прошлого конфига
    '@typescript-eslint/ban-ts-comment': 'warn',
    // Требует новую строку в конце файла
    'eol-last': ['error', 'always'],
    // Отключаем все правила typescript
    '@typescript-eslint/*': 'off',  
    'no-prototype-builtins': 'off',
    'no-extra-boolean-cast': 'off',  // Отключаем правило для !!
    'no-undef': 'off',  // Отключаем проверку неопределенных переменных
    'no-empty': 'off',  // Отключаем проверку пустых блоков
    'no-useless-catch': 'off',  // Отключаем проверку ненужных try/catch
    'no-case-declarations': 'off',  // Отключаем предупреждение о декларациях в case
    // 'react-refresh/only-export-components': 'warn',     // Предупреждение если компонент не экспортируется
    'react/jsx-uses-react': 'off',                      // Отключает необходимость импорта React (для React 17+)
    'react/react-in-jsx-scope': 'off',                  // Тоже отключает необходимость импорта React
    //#region Правила для сортировки импортов в файлах:
    'unused-imports/no-unused-imports': 'warn',         // Предупреждение если импорт не используется
    'import/order': [
        'warn',
        {
            'groups': [
                "builtin",    // Встроенные модули Node.js (fs, path и т.д.)
                "external",   // Установленные npm пакеты
                "internal",   // Внутренние пути из настроек
                "parent",     // Импорты из родительских директорий (../)
                "sibling",    // Импорты из той же директории (./)
                "index"       // Импорты из индексных файлов
            ],
            'pathGroupsExcludedImportTypes': ['builtin'],
            'newlines-between': 'always',
            'alphabetize': {
                'order': 'asc',         // Сортировка по алфавиту
                'caseInsensitive': true // Игнорировать регистр при сортировке
            }
        }
    ],
    //#endregion
  },
  overrides: [
    {
      // Для JS файлов отключаем правила, которые требуют ES Modules
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
};
