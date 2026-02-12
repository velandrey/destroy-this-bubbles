# Документация игрового движка

## Общая схема
Игровой контур разделён на 3 слоя:
- `GameEngine` — связывает canvas, модель и рендерер, управляет циклом `requestAnimationFrame`.
- `GameModel` — вся бизнес-логика: таймер, очки, спавн, клики, завершение игры.
- `GameRenderer` — только отрисовка состояния на canvas.

Дополнительные модули:
- `SpawnLogic` — генерация целей.
- `Circle` — объект цели (рост, сжатие, попадание, звук).
- `FloatingText` — визуализация начисленных очков.
- `checkHit` — проверка попадания по активным целям.

## Жизненный цикл
1. `GameEnter` создаёт `GameEngine(canvas, onGameOver, gameSettings)` и вызывает `start()`.
2. `GameEngine.start()` запускает `GameModel.start()` и игровой цикл.
3. На каждом кадре:
   - `model.update(time)`;
   - чтение `model.currentGameState`;
   - `renderer.renderGame(state)`.
4. При окончании времени `GameModel.endGame()` вызывает `onGameOver({ score, timestamp })`.
5. React-страница сохраняет результат в Redux и отправляет его в leaderboard.

## Класс `GameEngine`

### Задачи
- Инициализировать `GameModel` и `GameRenderer`.
- Конвертировать координаты клика из viewport в систему координат canvas.
- Передавать клики в модель (`processClick`).
- Останавливать цикл и отписываться от `click` в `destroy()`.

### Ключевые методы
- `start()` — старт игры и цикла кадров.
- `loop(time)` — обновление модели + отрисовка, пока игра активна.
- `handleClick(event)` — обработка клика через `model.processClick`.
- `destroy()` — остановка и очистка слушателей.

## Класс `GameModel`

### Состояние
- `circles: Circle[]`
- `floatingTexts: FloatingText[]`
- `score: number`
- `secondsRemaining: number`
- флаги `isRunning`, `isGameOver`

### Что делает `update(currentTime)`
- Считает оставшееся время.
- Спавнит новые круги через `SpawnLogic`.
- Обновляет существующие круги и удаляет неактивные.
- Обновляет и фильтрует плавающие тексты.
- Завершает игру при `secondsRemaining === 0`.

### Обработка клика
- `checkHit(circles, x, y)` ищет цель под курсором.
- Если промах:
  - штраф `scoreOnMiss`;
  - звук промаха;
  - счёт не уходит ниже нуля.
- Если попадание:
  - вычисляются бонусы точности и скорости;
  - добавляется `scoreOnHit + accuracyLevel + speedLevel`;
  - создаётся `FloatingText("+N")`;
  - цель помечается как уничтоженная.

### Формула очков
- `gained = scoreOnHit + accuracyLevel + speedLevel`
- `accuracyLevel` зависит от расстояния до центра цели.
- `speedLevel` зависит от времени жизни цели (раньше клик — выше бонус).

## `SpawnLogic`
- Следит за интервалом появления (`spawn.interval`).
- Ограничивает число целей (`spawn.maxCircles`).
- Создаёт цели в случайной позиции в границах canvas с учётом `maxRadius`.

## `Circle`
- Растёт от `minRadius` до `maxRadius`, затем сжимается.
- При достижении минимума деактивируется.
- `containsPoint(x, y)` проверяет попадание внутрь текущего радиуса.
- `pop()` деактивирует цель и проигрывает звук попадания.
- `lifetime` используется для расчёта бонуса скорости.

## `GameRenderer`
- Очищает canvas фоном.
- Рисует цели и плавающие тексты.
- Показывает HUD:
  - `Score: ...`
  - `Time: ...s`

Примечание: цвет фона берётся из `defaultGameSettings.game.backgroundColor`.

## Настройки (`TGameSettings`)
Базовые значения берутся из `defaultGameSettings` (Redux slice `game`):
- `circle`: `minRadius`, `maxRadius`, `growthSpeed`, `color`, `totalLevels`, `totalTimeLevels`
- `spawn`: `interval`, `maxCircles`
- `game`: `backgroundColor`, `scoreOnHit`, `scoreOnMiss`, `gameDuration`

Эти параметры меняются пользователем в лаунчере перед стартом игры.
