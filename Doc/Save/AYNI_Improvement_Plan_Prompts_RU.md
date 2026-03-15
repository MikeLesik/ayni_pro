# AYNI Gold — План улучшений по результатам UX-аудита
# Решения + Промты для Claude Code

**Дата:** 1 марта 2026  
**Основа:** UX-аудит 7 экранов дашборда  
**Формат:** 6 спринтов, каждый с описанием задач, решениями и готовыми промтами

---

## Общая структура спринтов

| Спринт | Фокус | Срок | Зависимости |
|--------|-------|------|-------------|
| **Sprint 1** | Compliance Sweep — замена запрещённых терминов | 1 день | Нет |
| **Sprint 2** | Цепочка стоимости — объяснение USD↔AYNI↔PAXG↔Gold | 1–2 дня | Нет |
| **Sprint 3** | Home-экран — информационная иерархия + упрощение | 2–3 дня | Sprint 1 |
| **Sprint 4** | Earn — рефрейминг доходности + способы оплаты | 1–2 дня | Sprint 1 |
| **Sprint 5** | Activity + Positions — исправление багов и UX | 2 дня | Sprint 1 |
| **Sprint 6** | Trust Layer — контент о команде, добыче, аудитах | 3–5 дней | Контент от фаундера |

---

## SPRINT 1: Compliance Sweep (Глобальная замена терминологии)

### Проблема
10 compliance-нарушений обнаружено на 7 экранах. Самое критичное — кнопка «Start Earning» присутствует в навигации на КАЖДОМ экране (7+ показов). Слова «invest», «staked», «reward», «earning» создают регуляторный риск по securities law.

### Решение
Глобальный поиск и замена по всем файлам UI: компоненты, i18n-файлы (EN/RU/ES), мок-данные, типы. Один проход — полная очистка.

### Промт для Claude Code

```
## Задача: Compliance Sweep — глобальная замена запрещённой терминологии

### Контекст
AYNI Gold — платформа токенизации золотодобычи. Юридически это НЕ инвестиционный продукт. 
Мы обязаны избегать терминов, которые классифицируют платформу как securities/investment product.

### Что сделать

1. Найди ВСЕ файлы в проекте, содержащие запрещённые термины (включая i18n, компоненты, моки, типы, константы).

2. Выполни замены по следующей таблице:

| Запрещено (EN) | Замена (EN) | Запрещено (RU) | Замена (RU) | Запрещено (ES) | Замена (ES) |
|---|---|---|---|---|---|
| Start Earning | Get Started | Начать зарабатывать | Начать | Empezar a ganar | Comenzar |
| Earn (как раздел меню) | Earn (оставить — это имя раздела) | — | — | — | — |
| invest / invested / investment | participate / participated / participation | инвестировать / инвестиция | участвовать / участие | invertir / inversión | participar / participación |
| Staked / Staking (в UI-текстах) | Activated / Locked | Застейкано | Активировано / Зафиксировано | Staked | Activado / Bloqueado |
| reward / rewards | distribution / distributions | награда / вознаграждение | выплата / распределение | recompensa | distribución |
| Daily reward log | Daily distribution log | Лог наград | Лог выплат | Registro de recompensas | Registro de distribuciones |
| Start receiving gold-backed rewards | Start receiving gold-backed distributions | Начните получать золотые награды | Начните получать золотые выплаты | — | — |
| earnings / earned | received / distributions | заработок | получено / выплаты | ganancias | distribuciones |
| portfolio (если есть) | positions | портфель | позиции | portafolio | posiciones |
| profit | distribution | прибыль | выплата | ganancia | distribución |
| guaranteed | estimated | гарантированный | ожидаемый | garantizado | estimado |
| accruing rewards | accruing distributions | накопление наград | накопление выплат | — | — |
| return on investment / ROI | distribution rate | — | — | — | — |

3. Особые случаи, требующие осторожности:
   - Кнопка "Start Earning" в NavBar/Header — заменить на "Get Started" 
   - Заголовок страницы "Start Earning" на Earn-странице — заменить на "Start Participating"
   - "Your tokens start accruing rewards immediately" → "Your distributions begin accruing immediately"
   - Все ачивки на My Mine: "First Investment" → "First Participation", "Total investments reached $500" → "Total participation reached $500"
   - Activity записи: "Invested $150.00 → 510.73 AYNI, staked for 12 months" → "Participated $150.00 → 510.73 AYNI, locked for 12 months"
   - "Staked 510.73 AYNI for 12mo" → "Activated 510.73 AYNI for 12mo"
   
4. НЕ трогать:
   - Юридические документы (Terms, Privacy Policy) — они проверены юристами
   - Технические переменные/типы (StakingPosition в TypeScript можно оставить)
   - Whitepaper
   - Внутренние комментарии в коде

5. После замен:
   - Запусти `grep -rn "invest\|Invest\|INVEST\|staked\|Staked\|reward\|Reward\|earning\|Earning" src/` для проверки остатков
   - Исключи из grep: node_modules, .git, типы TypeScript (interface names)
   - Выведи список всех изменённых файлов

### Порядок файлов для обработки
1. Сначала i18n/локализация (en.json, ru.json, es.json или аналоги)
2. Затем общие компоненты (NavBar, Header, CTA-кнопки)
3. Затем страницы по порядку: Home → Earn → Positions → My Mine → Activity → Learn → Settings
4. Мок-данные (mock/data/*)
5. Константы и конфиги
```

---

## SPRINT 2: Цепочка стоимости (Value Flow Explainer)

### Проблема
Пользователь сталкивается с 4 единицами стоимости (USD, AYNI, PAXG, граммы золота) без объяснения их связи. Ни один экран не показывает цепочку: $ → AYNI → добыча → золото → PAXG → $. Это фундаментальный провал понимания для Web2-аудитории.

### Решение
Создать два компонента:
1. **ValueFlowTooltip** — компактная всплывающая подсказка с 5-шаговой цепочкой, вызывается по клику на иконку (i) рядом с любым значением в AYNI/PAXG/g
2. **ValueFlowSection** — полноценная секция на Learn-странице с интерактивной диаграммой

### Промт для Claude Code

```
## Задача: Компонент "Цепочка стоимости" — ValueFlowTooltip + ValueFlowSection

### Контекст
Пользователи AYNI не понимают связь между 4 единицами: USD ($), AYNI (токен), PAXG (золотой токен), граммы золота (g).
Цепочка такая:
1. Пользователь платит $ (USD) → покупает токены AYNI
2. Токены AYNI = доля в добывающей мощности на концессии
3. Концессия добывает золото (измеряется в граммах)
4. Золото конвертируется в PAXG (1 PAXG ≈ 1 тройская унция золота)
5. PAXG накапливается на виртуальном кошельке → можно вывести в $ или PAXG

### Компонент 1: ValueFlowTooltip

Файл: `src/components/ui/ValueFlowTooltip.tsx`

Поведение:
- Маленькая иконка (i) или (?) размером 16px
- По клику/hover — Radix UI Tooltip с содержимым
- Содержимое: горизонтальная цепочка из 5 шагов с иконками
- Каждый шаг: иконка + короткий лейбл + стрелка →
- Шаги: $ → AYNI → ⛏ Mining → Gold (g) → PAXG → $
- Ширина tooltip: max 480px
- Внизу: ссылка "Подробнее →" ведёт на /learn#how-value-flows
- Стилизация: bg surface-card, border, shadow-lg, radius-xl
- i18n: тексты через useTranslation

Размещение иконки (i):
- Home: рядом с "AYNI Balance" и "Gold Rewards" в Daily reward log
- Positions: рядом с "Holding 510.73 AYNI" и "Distributed $29.00"
- Earn: рядом с "≈ 1,702.42 AYNI at $0.2937/token"

### Компонент 2: ValueFlowSection

Файл: `src/components/learn/ValueFlowSection.tsx`

Поведение:
- Секция для Learn-страницы с id="how-value-flows" (для якорных ссылок)
- Заголовок: "Как работает цепочка стоимости" (heading-2)
- 5 шагов горизонтально (desktop) / вертикально (mobile < 768px)
- Каждый шаг — карточка:
  - Иконка (Lucide): DollarSign → Coins → Pickaxe → Scale → Wallet
  - Заголовок шага (body-md bold)
  - Описание 1–2 предложения (body-sm, text-secondary)
  - Между карточками: стрелки-коннекторы (→ desktop, ↓ mobile)
- Под диаграммой: блок "Пример" с конкретными цифрами:
  "$500 → 1,702 AYNI → добыча ~0.013g/день → ~$190 в PAXG за 12 мес"
  (disclaimer: "Оценка на основе текущих показателей добычи. Не гарантировано.")
  
Дизайн:
- Используй design tokens из проекта: --color-primary, --color-gold, --color-bg-secondary
- Карточки: bg surface-card, shadow-sm, radius-lg, p-20
- Стрелки: цвет --color-gold
- Responsive: flex-row → flex-col
- Анимация: stagger fadeIn при входе в viewport (Framer Motion, если используется)

### Интеграция

1. Добавь ValueFlowTooltip на Home рядом с "AYNI Balance" и "Gold Rewards"
2. Добавь ValueFlowTooltip на Positions рядом с "Holding X AYNI"
3. Добавь ValueFlowTooltip на Earn рядом с конвертацией "≈ X AYNI at $Y/token"
4. Добавь ValueFlowSection на Learn-страницу между FAQ и "How your participation works"
5. Обнови якорную навигацию: ссылка "Подробнее →" из тултипа ведёт на /learn#how-value-flows
```

---

## SPRINT 3: Home-экран — Упрощение и иерархия

### Проблема
- Mining details показаны по умолчанию (когнитивная перегрузка для Web2)
- Таблица Daily reward log содержит 5 колонок с необъяснёнными единицами
- Цены AYNI/PAXG в навигации бессмысленны для Web2
- CTA «Start receiving gold-backed rewards» нерелевантен для пользователя с позициями
- График без контекста (кумулятивный? дневной?)

### Решения
1. Mining details скрыты по умолчанию (toggle "Show mining details")
2. Упрощённый режим таблицы: только DATE + RECEIVED ($) + NET (g). Полная таблица за toggle.
3. Навбар: цены AYNI/PAXG видны только при Advanced view = ON
4. CTA адаптивный: если есть позиции → "Increase participation", если нет → "Start participating"
5. Подпись графика с объяснением

### Промт для Claude Code

```
## Задача: Рефакторинг Home-экрана (Dashboard) — упрощение для Web2

### Контекст
По результатам UX-аудита, Home-экран перегружен для Web2-пользователей. 
Ключевой принцип: "Dollars on top, AYNI underneath". По умолчанию показываем максимально простой USD-вид.
Advanced/crypto детали — за toggle (из uiStore.advancedView).

### Изменение 1: Mining details скрыты по умолчанию

В Daily reward log секции:
- Состояние по умолчанию: скрытое (collapsed)
- Кнопка: "Show mining details" (вместо текущего "Hide mining details")
- При раскрытии: показываются полные колонки GOLD, COSTS, FEE, NET
- При скрытии (дефолт): показываются только DATE + RECEIVED ($)
- Связать с uiStore (persist в localStorage): если пользователь раскрыл — запомнить
- Блок "AYNI Balance / AYNI Price / Gold Rewards" тоже за toggle (visible только при advancedView=true или при раскрытии mining details)

### Изменение 2: Упрощённая таблица по умолчанию

Текущая таблица: DATE | RECEIVED ($) | GOLD | COSTS | FEE | NET
Упрощённая таблица (дефолт): DATE | RECEIVED ($)
- Только две колонки: дата и сумма в USD
- Чистый, понятный вид: "29 марта — $0.32"
- При клике на "Show mining details" → раскрываются все 6 колонок
- Добавить тултипы (i) на заголовки колонок GOLD, COSTS, FEE, NET с кратким объяснением:
  - GOLD: "Сколько золота добыто вашей долей за этот день"
  - COSTS: "Операционные расходы на добычу (extraction costs)"
  - FEE: "Сервисная комиссия платформы (success fee)"
  - NET: "Чистое количество золота, зачисленное на ваш счёт"

### Изменение 3: Навбар — скрытие цен для Web2

В компоненте NavBar/Header:
- Элементы "AYNI $0.2937" и "PAXG $5,192.28" — условный рендеринг:
  - Видны когда uiStore.advancedView === true
  - Скрыты когда false
- Это освобождает пространство в навбаре и убирает крипто-жаргон для Web2-пользователей
- На мобиле эти элементы не показывать вообще (только в desktop advanced view)

### Изменение 4: Контекстный CTA в нижнем баннере

Текущий баннер: "Start receiving gold-backed distributions" (статичный)
Новая логика:
- if (positions.length === 0): "Start receiving gold-backed distributions" + CTA "Get Started" → /earn
- if (positions.length > 0 && availableBalance > 0): "You have $X available" + CTA "Open new position" → /earn
- if (positions.length > 0 && availableBalance === 0): "Increase your participation" + CTA "Add funds" → /earn
- Данные берём из portfolioStore или dashboardResponse

### Изменение 5: Подпись графика

В компоненте "Distributions over time" (chart):
- Добавить подпись под графиком: "Cumulative distributions received in USD" (body-sm, text-muted)
- На русском: "Общая сумма полученных выплат в USD"
- Ось Y: форматировать как "$X" (уже сделано), добавить больше делений для наглядности
- Добавить точку с тултипом при hover: дата + сумма за день + кумулятивная сумма

### Изменение 6: Заголовок графика

Текущий: "Distributions over time"
Новый: "Total received over time" / "Общая сумма полученных выплат"
- Более понятный для Web2 заголовок, не содержит крипто-жаргон

### Техническое

- Все тексты через i18n (EN/RU/ES)
- Состояние mining details: uiStore.miningDetailsExpanded (boolean, persist)
- Условные рендеры через advancedView из uiStore
- Не ломать существующую структуру данных — только UI слой
```

---

## SPRINT 4: Earn-страница — Рефрейминг доходности + Оплата

### Проблема
- "~38.6% est. annual distribution rate" — агрессивная цифра, убивает доверие у всех персон
- Нет индикации принимаемых способов оплаты
- "First payout Jun 29, 2026" без объяснения квартального графика
- "Auto-start accruing" — финансовый жаргон
- "After unlock: Sell, restake, or withdraw" — непонятно что значит "sell"

### Решения
1. Рефрейминг доходности: показывать граммы золота как основную метрику, процент — мелким шрифтом
2. Блок принимаемых способов оплаты перед CTA
3. Пояснение квартального графика выплат
4. Замена жаргона на человеческий язык

### Промт для Claude Code

```
## Задача: Рефакторинг Earn-страницы — рефрейминг доходности и UX-улучшения

### Контекст
Earn-страница — лучший экран в приложении, но имеет 3 критических проблемы:
1. 38.6% annual rate выглядит как скам для всех аудиторий
2. Пользователь не знает, чем можно заплатить
3. Несколько непонятных формулировок

### Изменение 1: Рефрейминг панели проекций

Текущая панель "PROJECTED DISTRIBUTIONS FOR 12 MONTHS":
```
$190.16
~38.6% est. annual distribution rate
Monthly distribution ~$15.85
Daily distribution ~$0.53
```

Новая панель "PROJECTED OUTPUT FOR 12 MONTHS":
```
ESTIMATED GOLD OUTPUT
~1.56g of gold
≈ $190.16 at current gold price

Monthly output     ~0.13g  ≈ $15.85
Daily output       ~0.004g ≈ $0.53
First payout       Jun 29, 2026

Paid in            PAXG (gold-backed token)
You will hold      1,702.42 AYNI
After term ends    Withdraw, extend, or convert
```

Ключевые изменения:
- Главная метрика: ГРАММЫ ЗОЛОТА (крупно), USD-эквивалент рядом (мельче)
- Процент "~38.6% est. annual distribution rate" → переместить ВНИЗ мелким шрифтом:
  "~38.6% est. annual rate based on current mining output" (body-sm, text-muted)
  Или убрать процент совсем, оставить только граммы + USD
- "After unlock: Sell, restake, or withdraw" → "After term ends: Withdraw, extend, or convert"
  Убираем "sell" (непонятно), "restake" (жаргон)
- Добавить строку: "Quarterly payouts" с иконкой календаря и пояснением:
  "Distributions are calculated daily, paid quarterly to your account"

### Изменение 2: Блок способов оплаты

Добавить секцию между CTA-кнопкой и дисклеймером "By participating...":

```tsx
<div className="flex items-center gap-3 justify-center mt-3">
  <span className="text-sm text-muted">Accepted:</span>
  <CreditCardIcon /> {/* иконка карты */}
  <span className="text-sm">Visa / MC</span>
  <span className="text-muted">·</span>
  <WalletIcon />
  <span className="text-sm">USDT / USDC</span>
  <span className="text-muted">·</span>
  <BankIcon />
  <span className="text-sm">Wire</span>
</div>
```

- Используй иконки из Lucide: CreditCard, Wallet, Building2
- Стиль: text-sm, text-secondary, centered, gap-2
- Не кнопки — просто информационная строка

### Изменение 3: Пояснение первой выплаты

Рядом с "First payout Jun 29, 2026" добавить:
- Иконка (i) с тултипом: "Distributions accrue daily from the moment of activation. Payouts are made quarterly. Your first payout will include all distributions accrued since activation."
- На русском: "Выплаты начисляются ежедневно с момента активации. Вывод производится ежеквартально. Первая выплата включит все накопленные распределения."

### Изменение 4: Замена формулировок

- "Auto-start accruing" → "Immediate activation" + подпись: "Your gold distributions begin accruing from day one"
  На русском: "Мгновенная активация — золотые выплаты начинают накапливаться с первого дня"
- "Acquire AYNI tokens and receive gold-backed distributions from real mining." (подзаголовок) — ОК, оставить
- Проверить что "Start Earning" в заголовке уже заменён на "Start Participating" (Sprint 1)

### Изменение 5: Trust-бейджи → кликабельные

Текущие: PeckShield Audited | Certik Verified | Licensed Mining | Funds Protected — статичные.
Сделать кликабельными:
- PeckShield → ссылка на PDF отчёта (или /trust#audits)
- Certik → ссылка на Certik page
- Licensed Mining → ссылка /trust#mining
- Funds Protected → тултип с объяснением стабфонда

### Все тексты через i18n (EN/RU/ES)
```

---

## SPRINT 5: Activity + Positions — Баги и UX

### Проблемы
- Activity: "+-$120.00" UI-баг, "Invested/Staked" compliance (Sprint 1), три одинаковых депозита, смешение USD/AYNI
- Positions: "Restake" жаргон, "GOLD REWARDS 0.00 g" путает, кнопки Withdraw/Restake не disabled при $0

### Промт для Claude Code

```
## Задача: UX-фиксы для Activity и Positions страниц

### ACTIVITY

#### Фикс 1: Знак суммы для выводов
Текущее: "+-$120.00" и "+-$60.53" для withdrawal-транзакций
Причина: баг в форматировании — "+" и "-" отображаются одновременно
Исправление:
- Для withdrawals (type: 'withdrawal'): показывать "+$120.00" (зелёным, --color-success) — деньги ПОЛУЧЕНЫ на внешний кошелёк
- Для deposits/purchases (type: 'deposit', 'purchase', 'stake'): показывать "-$500.00" (серым, --text-secondary) — деньги ПОТРАЧЕНЫ
- Для distributions (type: 'distribution'): показывать "+$0.32" (зелёным)
- Найди функцию форматирования суммы в activity и исправь логику знака

#### Фикс 2: Единообразие единиц в колонке суммы
Текущее: депозиты показывают "-$500.00" (USD), но покупки "-$510.73" (количество AYNI)
Исправление:
- Все суммы в основной колонке — в USD
- "Purchased 510.73 AYNI" → сумма "-$150.00" (не -$510.73)
- Количество AYNI показывать в описании: "Bought 510.73 AYNI for $150.00"

#### Фикс 3: Объединение связанных транзакций
Текущее: "Purchased 510.73 AYNI" и "Activated 510.73 AYNI for 12mo" — две строки для одного действия
Решение (два варианта — выбери проще):
- Вариант A: Объединить в одну строку: "Participated $150.00 — 510.73 AYNI locked for 12 months" / -$150.00
- Вариант B: Визуально связать: вторая строка с отступом и линией-коннектором слева, без отдельной суммы

#### Фикс 4: Экспорт (новый функционал)
Добавить кнопку в хедере Activity-страницы:
- Иконка Download (Lucide) + "Export"
- По клику: dropdown с двумя опциями "Download CSV" и "Download PDF"
- CSV: стандартная выгрузка всех транзакций (date, type, description, amount_usd, amount_token)
- PDF: форматированная таблица с шапкой "AYNI Gold — Activity Report" + даты + итого
- Для MVP: CSV достаточно. PDF — можно отложить.

### POSITIONS

#### Фикс 5: "Restake" → "Reinvest"
- Кнопка "Restake" → "Reinvest" 
- Тултип при hover: "Convert your PAXG distributions to AYNI tokens (1.5% conversion fee)"
- На русском: "Реинвестировать" + тултип "Конвертировать выплаты PAXG в токены AYNI (комиссия 1.5%)"

#### Фикс 6: Disabled-состояние кнопок при нулевом балансе
Текущее: "Withdraw" и "Reinvest" кликабельны даже при "GOLD REWARDS 0.00 g"
Исправление:
- if (goldRewardsBalance <= 0): кнопки Withdraw и Reinvest получают disabled state
- Визуально: opacity-50, cursor-not-allowed, bg-muted
- При hover на disabled: тултип "No distributions available yet. Your next payout is on {date}."

#### Фикс 7: Пояснение "GOLD REWARDS 0.00 g"
Текущее: пользователь видел $60.53 total received на Home, но здесь "0.00 g" — противоречие.
Причина: $60.53 — это симулированное daily accrual, а GOLD REWARDS — это claimable PAXG (выплачивается квартально).
Исправление:
- Добавить подпись под "GOLD REWARDS 0.00 g":
  "Quarterly payout. Next: Apr 27, 2026 · ~$4.60 estimated"
- Добавить тултип (i) на "GOLD REWARDS": 
  "Gold distributions accrue daily but are paid out quarterly to this balance. On payout day, your accrued gold will appear here for withdrawal."

#### Фикс 8: Дифференциация позиций
Текущее: Position #2 и #3 выглядят одинаково.
Решение:
- Добавить возможность именования позиции (опционально): "My first position" или автоимя "Gold Position 1"
- Если нет кастомного имени: использовать формат "Position · Jan 2026" (по дате создания)
- Различный accent-color для каждой позиции: первая — gold, вторая — primary, третья — subtle green
  (цветная полоска 3px слева от карточки)

### Все тексты через i18n. Compliance-замены из Sprint 1 уже должны быть применены.
```

---

## SPRINT 6: Trust Layer — Контент о команде, добыче, аудитах

### Проблема
Главный блокер конверсии: на 7 экранах нет ни одного доказательства реальной добычи, нет информации о команде, нет ссылок на аудиты. «Backed by real mining» — пустой бейдж.

### Решение
Расширить Learn-страницу Trust-секцией. Контент частично уже есть на Homepage сайта (Minerales SH, Scoping Study, PeckShield/Certik). Нужно перенести внутрь дашборда.

### Промт для Claude Code

```
## Задача: Trust Layer — секции доверия внутри дашборда

### Контекст
Согласно UX-аудиту, отсутствие trust-контента — главный блокер конверсии для ВСЕХ персон.
На Homepage сайта (ayni.gold) уже есть Trust-страница с информацией о Mineralis, аудитах, Scoping Study.
Задача: перенести ключевые trust-элементы ВНУТРЬ дашборда (Learn-страница + новая Trust-секция).

### Часть 1: Trust-секция на Learn-странице

Добавить новый блок на Learn-страницу ПЕРЕД FAQ:

```
[TRUST SECTION] — id="trust"

"Why you can trust AYNI" — heading-2

[CARD GRID: 2 колонки desktop, 1 mobile]

Card 1: "Mining Partner"
  - Иконка: Mountain (Lucide)
  - Заголовок: "Minerales San Hilario S.C.R.L."
  - Текст: "Licensed gold mining company based in Peru. Concession #070011405 registered with INGEMMET. 8 km² alluvial concession in Madre de Dios."
  - CTA: "View Scoping Study →" (ссылка на PDF)

Card 2: "Security Audits"
  - Иконка: ShieldCheck (Lucide)
  - Заголовок: "Independently Audited"
  - Текст: "Smart contracts audited by PeckShield and CertiK. ERC-20 token standard."
  - CTA links: "PeckShield Report →" | "CertiK Audit →" (ссылки на внешние отчёты)

Card 3: "Legal Entity"
  - Иконка: Building2 (Lucide)
  - Заголовок: "AYNI TOKEN INC."
  - Текст: "International Business Company incorporated in British Virgin Islands. Company #2174797."
  - CTA: "View Terms →" (ссылка на /terms)

Card 4: "Mining Equipment"
  - Иконка: Truck (Lucide)
  - Заголовок: "Real Operations"
  - Текст: "6 excavators, 3 loaders, 3 dump trucks, 4 scrubber-trommel units. Full gravity-based gold separation."
  - CTA: "See Photos →" (ссылка на галерею или trust page)
```

### Часть 2: Proof of Mining секция

Добавить после Trust-карточек:

```
[PROOF OF MINING] — id="proof-of-mining"

"Mining Transparency" — heading-2

[STATUS BADGE]
  🟢 "Mining Active" — бейдж green, inline
  "San Hilario, Madre de Dios, Peru"

[LATEST REPORT CARD] — bg surface-card, radius-xl, p-24
  "Latest Report — Week of [дата]"
  Gold extracted: [Xg] (данные из мока или API)
  Operational hours: [Xh]
  Equipment utilization: [X%]
  [View full report → PDF link]

[PHOTO PLACEHOLDER]
  Placeholder для карусели фотографий с концессии
  3-5 слотов: "Site photo 1", "Site photo 2" и т.д.
  Текст-заглушка: "Photos from our mining operation will appear here"
  Стиль: серые placeholder-карточки с иконкой Camera
```

### Часть 3: "Backed by real mining" бейдж на Home → кликабельный

На Home-экране найти бейдж "Backed by real mining":
- Сделать кликабельным: при клике → navigate(/learn#trust)
- Добавить cursor-pointer, hover: underline или slight scale
- Текст на русском: "Подтверждено реальной добычей" (если i18n)

### Часть 4: FAQ расширение для Web3

Добавить в FAQ на Learn-странице:
- "Where can I verify on-chain?" → ответ с адресом контракта, ссылкой на Etherscan
- "What blockchain is AYNI on?" → "AYNI is an ERC-20 token on Ethereum mainnet."
- "Where are the audit reports?" → ссылки PeckShield + CertiK
- "What is the token contract address?" → адрес + кнопка Copy

### Технические детали
- Все тексты через i18n
- Мок-данные для "Latest Report" в mock/data/trust.ts
- Фото-плейсхолдеры — реальные изображения добавятся позже
- Стили: используй существующие design tokens из проекта
- Карточки: компонент Card из UI Kit с variant="stat" или новый variant="trust"
```

---

## Дополнительные быстрые фиксы (можно включить в любой спринт)

### Промт: Мелкие UX-фиксы

```
## Задача: Мелкие UX-фиксы из UX-аудита

### 1. Settings: скрыть "Coming soon" или заменить на waitlist
Пункты "Payment methods", "Notifications", "Referral" показывают серый текст "Coming soon".
Решение: заменить "Coming soon" на кнопку-бейдж "Notify me" (маленький, ghost-стиль).
При клике: toast "We'll notify you when this feature is available" + сохранить в user preferences.
Или: скрыть эти пункты полностью, показывать только при feature flag.

### 2. My Mine: исправить несогласованность streak
"2 day streak" (правый верхний угол) vs "Day 15 streak" (карточка production).
Проверить логику:
- Один streak-счётчик должен быть source of truth
- Вероятно "2 day streak" — текущий подряд, "Day 15" — общий. Нужно выровнять лейблы:
  - Верх: "🔥 2-day streak" (текущий подряд) 
  - Карточка: "Day 92 since start" (общее количество дней)

### 3. My Mine: compliance в ачивках
Проверить что Sprint 1 применён к ачивкам:
- "First Investment" → "First Participation"
- "Made your first investment" → "Made your first participation"
- "Total investments reached $500" → "Total participation reached $500"
- "Received your first daily reward" → "Received your first daily distribution"

### 4. Settings: аватар inconsistency
Аватар показывает "MI" (Mikhail), но навбар показывает "AL".
Найти source of truth для инициалов. Скорее всего баг в моке: навбар берёт данные из другого места.
Исправить: оба должны использовать user.firstName + user.lastName из authStore.

### 5. Positions: нумерация позиций
"Position #2" и "Position #3" — нет #1. 
Решение: в Completed-табе должна быть Position #1. Если нет — добавить мок.
Альтернативно: заменить нумерацию на даты: "Position · Jan 28, 2026" вместо "Position #2".

### 6. My Mine: тональный переключатель для HNW
Добавить в настройках My Mine (или глобально в Settings):
- Toggle: "Simplified view" / "Расширенный вид"
- При Simplified: My Mine показывает только production data (граммы, USD) без визуальной шахты, рабочих, кирок
- Компактная таблица: Production | Equipment | Efficiency
- Без иллюстрации, без ачивок — чистый data view
- Привязать к uiStore.mineViewMode: 'game' | 'data'
```

---

## Порядок запуска

Рекомендуемая последовательность:

1. **Sprint 1** (Compliance) → запускай первым, без зависимостей, 1 день
2. **Sprint 4** (Earn рефрейминг) → второй, так как Earn — главная конверсионная страница
3. **Sprint 3** (Home упрощение) → третий, улучшает first impression
4. **Sprint 5** (Activity + Positions) → четвёртый, фиксит баги
5. **Sprint 2** (Value Flow) → пятый, добавляет обучающий слой
6. **Sprint 6** (Trust Layer) → последний, зависит от контента (фото, отчёты)
7. **Мелкие фиксы** → вклинивай в любой спринт, где есть время

---

## Чеклист после всех спринтов

- [ ] `grep -rn "invest\|Invest\|staked\|Staked\|reward\|Reward\|earning\|Earning" src/` — 0 результатов в UI-текстах
- [ ] Навбар: "Start Earning" заменён на "Get Started" на всех экранах
- [ ] Home: mining details скрыты по умолчанию
- [ ] Home: цены AYNI/PAXG скрыты при advancedView=false
- [ ] Earn: граммы золота — основная метрика, процент — мелким или убран
- [ ] Earn: способы оплаты видны перед CTA
- [ ] Earn: trust-бейджи кликабельны
- [ ] Activity: знаки сумм корректны (+ для входящих, - для исходящих)
- [ ] Activity: все суммы в USD
- [ ] Positions: "Restake" → "Reinvest"
- [ ] Positions: disabled-кнопки при нулевом балансе
- [ ] Learn: Trust-секция с Mineralis, аудитами, юрлицом
- [ ] Learn: Proof of Mining секция (хотя бы placeholder)
- [ ] Learn: ValueFlowSection с цепочкой стоимости
- [ ] Learn: FAQ для Web3 (контракт, сеть, аудиты)
- [ ] My Mine: compliance в ачивках
- [ ] Settings: "Coming soon" → "Notify me" или скрыты
- [ ] Все тексты на 3 языках (EN/RU/ES)
