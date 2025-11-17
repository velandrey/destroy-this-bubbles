# Документация игровых модулей

## GameEngine

### Назначение
`GameEngine` управляет игровым процессом: временем, отрисовкой, обработкой кликов, подсчётом очков и состоянием игры.

### Основные задачи
- запуск и остановка игры  
- обработка попаданий и промахов  
- спавн кругов  
- обновление и отрисовка объектов  
- отображение таймера и счёта  
- кнопка перезапуска

### Пример использования
```ts
	if (!canvasRef.current) return;
	const engine = new GameEngine(canvasRef.current);
	engine.start();
```

---

## Класс GameEngine

### Аргументы конструктора
|           Имя           | Описание                                     |
|:-----------------------:|:-------------------------------------------- |
|         **ctx**         | 2D контекст на котором будет рисоваться игра |
|       spawnLogic        | Логика спавна кругов                         |
| canvas.addEventListener | Обработка кликов по канвасу                  |
|          rect           | Положение канваса для обработки кликов       |

### start()
Запускает игру, сбрасывает время и запускает цикл обновления.

```ts
start() {
    this.clear()
    this.startTime = performance.now()
    this.lastTime = this.startTime
    this.isRunning = true
    requestAnimationFrame((time) => this.loop(time))
}
```

### loop()
Основной цикл игры, вызывается через `requestAnimationFrame`.
Обрабатывает время генерации кадра через deltaTime

```ts
private loop(currentTime: number) {
    const deltaTime = currentTime - this.lastTime
    const elapsedTime = currentTime - this.startTime

    if (elapsedTime >= gameSettings.game.gameDuration) {
        this.endGame()
        return
    }

    this.update(deltaTime, currentTime)
    this.draw(currentTime)

    requestAnimationFrame((time) => this.loop(time))
}
```

### handleClick()
Обрабатывает клики — попадание/промах, логика restart-кнопки.
Логика определения попадания, вызывается в методах checkHit затем, containsPoint:
- Для каждого круга вычисляется расстояние до центра от координат клика. Если меньше радиуса, то круг помечается для удаления, при следующем кадре.
- Проигрывается звук попадания.
- При промахе проигрывается звук промаха.

```ts
private handleClick(event: MouseEvent) {
    const x = ...
    const y = ...
    const result = checkHit(this.circles, x, y)

    if (!result.hit) {
        this.score -= 1
    } else {
        this.score += 1
    }
}
```

---

## Circle

### Назначение
Объект-мишень. Растёт до максимума, затем уменьшается и исчезает.

### Пример создания:
```ts
const circle = new Circle(100, 120, 5, 'red')
```

### update()
Растит и уменьшает круг.

```ts
update(deltaTime: number) {
    if (this.growing) {
        this.radius += growthSpeed * deltaTime / 1000
    } else {
        this.radius -= growthSpeed * deltaTime / 1000
    }
}
```

### draw()
Отрисовывает круг.

```ts
draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
}
```

### containsPoint()
Проверяет попадание в круг.

```ts
containsPoint(px: number, py: number) {
    const dx = px - this.x
    const dy = py - this.y
    return Math.sqrt(dx*dx + dy*dy) <= this.radius
}
```

---

## checkHit()

### Назначение
Определяет, попал ли пользователь в один из кругов.

### Пример:
```ts
const result = checkHit(circles, x, y)
if (result.hit) console.log('Попадание!')
```

### Код:
```ts
export function checkHit(circles, x, y) {
    for (const circle of circles) {
        if (circle.containsPoint(x, y)) {
            circle.pop()
            return { hit: true, circle }
        }
    }
    return { hit: false }
}
```

---

## SpawnLogic

### Назначение
Управляет созданием кругов на канвасе с случайными координатами.

### Пример:
```ts
const spawner = new SpawnLogic(canvas.width, canvas.height)
const circle = spawner.spawnCircle()
```

### spawnCircle()
Создаёт круг со случайной позицией.

```ts
spawnCircle() {
    const x = Math.random() * (this.canvasWidth - maxRadius * 2) + maxRadius
    const y = Math.random() * (this.canvasHeight - maxRadius * 2) + maxRadius
    return new Circle(x, y, minRadius, color)
}
```

---

## gameSettings

### Назначение
Конфигурация игры — параметры круга, спавна и длительности игры.

```ts
export const gameSettings = {
    circle: {
        minRadius: 1,
        maxRadius: 15,
        growthSpeed: 5,
        color: 'red'
    },
    spawn: {
        interval: 1000,
        maxCircles: 5
    },
    game: {
        backgroundColor: '#111',
        scoreOnHit: 1,
        scoreOnMiss: -1,
        gameDuration: 30000
    }
}
```
