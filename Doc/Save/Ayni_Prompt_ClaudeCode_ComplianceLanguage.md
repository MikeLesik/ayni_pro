# Промт для Claude Code: Compliance-safe формулировки (EN / RU / ES)

Скопируй и отправь в Claude Code.

---

```
## Задача

В кабинете AYNI Gold текст на всех трёх языках (EN, RU, ES) использует 
формулировки, которые триггерят классификацию как ценная бумага: 
"invest", "инвестировать", "invertir", "earnings", "доход", "ganancias" и т.д.

Нужно найти и заменить ВСЕ такие формулировки по таблицам ниже.
Замена только текстовая — не трогать стили, layout, логику, структуру компонентов.

Приложение поддерживает 3 языка: EN, RU, ES.
Найди файлы локализации (i18n json/ts файлы, или hardcoded строки в компонентах)
и замени в КАЖДОМ языке.

---

## ГЛОБАЛЬНЫЙ СЛОВАРЬ ЗАПРЕЩЁННЫХ СЛОВ

Искать по всему проекту (grep -ri). Заменять в UI-facing тексте.
Имена переменных в TypeScript менять НЕ обязательно, но все labels, 
placeholders, descriptions, toasts, modals — менять обязательно.

### Абсолютный запрет (заменять ВЕЗДЕ)

| EN запрещено | EN замена | RU запрещено | RU замена | ES запрещено | ES замена |
|---|---|---|---|---|---|
| invest (глагол) | participate | инвестировать | участвовать | invertir | participar |
| investment | participation | инвестиция / инвестирование | участие | inversión | participación |
| investor(s) | participant(s) | инвестор(ы) | участник(и) | inversor(es) / inversionista(s) | participante(s) |
| invested | participating | инвестировано | участие | invertido | participación |
| profit | — удалить — | прибыль / профит | — удалить — | ganancia / beneficio | — удалить — |
| guaranteed | — не использовать рядом с суммами — | гарантированный | — не использовать — | garantizado | — не использовать — |
| income | distribution | доход | распределение | ingreso / renta | distribución |
| ROI | distribution rate | ROI | ставка распределения | ROI / retorno | tasa de distribución |
| return (финансовый) | distribution | возврат / доходность | распределение | retorno / rendimiento | distribución |
| portfolio | positions | портфель (инвест.) | позиции | portafolio / cartera | posiciones |
| reinvest | restake | реинвестировать | рестейкнуть / конвертировать и застейкать | reinvertir | restakear / convertir y stakear |

### Контекстные замены (зависят от места)

| EN запрещено | EN замена | RU запрещено | RU замена | ES запрещено | ES замена |
|---|---|---|---|---|---|
| earnings (сущ.) | distributions | заработок / доход | распределения / начисления | ganancias / ingresos | distribuciones |
| earned | received / distributed | заработано | получено / начислено | ganado | recibido / distribuido |
| annual return | annual distribution rate | годовая доходность | годовая ставка распределения | retorno anual | tasa de distribución anual |
| estimated earnings | projected distributions | предполагаемый доход | прогноз распределений | ganancias estimadas | distribuciones proyectadas |
| daily earnings | daily distributions | дневной доход | дневные начисления | ganancias diarias | distribuciones diarias |
| start earning | start earning (ок) | начать зарабатывать | начать получать | comenzar a ganar | empezar a recibir |

### Что НЕ менять

- `Earn` — название секции в навигации (оставить на всех языках)
- `rewards` / `вознаграждения` / `recompensas` — ок
- `staking` / `stake` / `стейкинг` — ок
- `mining` / `майнинг` / `добыча` / `minería` — ок
- `17.5%` — оставить (но label рядом менять)
- `+$0.39 today` — оставить
- Цены, курсы, технические термины — оставить

---

## ПОЭКРАННЫЕ ЗАМЕНЫ

### 1. НАВИГАЦИЯ

| Элемент | EN было → стало | RU было → стало | ES было → стало |
|---|---|---|---|
| Nav item 3 | Portfolio → **Positions** | Портфель → **Позиции** | Portafolio → **Posiciones** |
| Mobile tab 3 | Portfolio → **Positions** | Портфель → **Позиции** | Portafolio → **Posiciones** |
| URL path | /portfolio → **/positions** | — | — |
| URL path | /portfolio/:id → **/positions/:id** | — | — |

Обнови роутер: все маршруты /portfolio* → /positions*. 
Добавь redirect с /portfolio на /positions для обратной совместимости.

---

### 2. HOME PAGE

| Элемент | EN | RU | ES |
|---|---|---|---|
| Hero label | ~~TOTAL EARNED~~ → **TOTAL RECEIVED** | ~~ВСЕГО ЗАРАБОТАНО~~ → **ВСЕГО ПОЛУЧЕНО** | ~~TOTAL GANADO~~ → **TOTAL RECIBIDO** |
| Daily badge | +$0.39 today (оставить) | +$0.39 сегодня (оставить) | +$0.39 hoy (оставить) |
| Stat card 1 label | ~~Invested~~ → **Participating** | ~~Инвестировано~~ → **Участие** | ~~Invertido~~ → **Participación** |
| Stat card 2 label | ~~Daily earnings~~ → **Daily distribution** | ~~Дневной доход~~ → **Дневные начисления** | ~~Ganancias diarias~~ → **Distribución diaria** |
| Stat card 3 label | Next payout (оставить) | След. выплата (оставить) | Próximo pago (оставить) |
| Chart title | ~~Earnings over time~~ → **Distributions over time** | ~~Доход за период~~ → **Начисления за период** | ~~Ganancias en el tiempo~~ → **Distribuciones en el tiempo** |
| Table title | ~~Daily earnings~~ → **Daily reward log** | ~~Дневной доход~~ → **Журнал начислений** | ~~Ganancias diarias~~ → **Registro de distribuciones** |
| CTA empty state | ~~Start earning from real gold mining~~ → **Start receiving gold-backed rewards** | ~~Начните зарабатывать на добыче золота~~ → **Начните получать вознаграждения обеспеченные золотом** | ~~Empieza a ganar con minería de oro real~~ → **Empieza a recibir recompensas respaldadas por oro** |
| Social proof | ~~1,247 people are already earning~~ → **1,247 participants are receiving rewards** | ~~1,247 человек уже зарабатывают~~ → **1,247 участников уже получают вознаграждения** | ~~1,247 personas ya están ganando~~ → **1,247 participantes ya reciben recompensas** |

---

### 3. EARN PAGE

| Элемент | EN | RU | ES |
|---|---|---|---|
| Page title | Start Earning (оставить) | Начать (оставить) | Empezar (оставить) |
| Subtitle | ~~Invest in gold mining and earn daily rewards in gold-backed PAXG~~ → **Acquire AYNI tokens and receive gold-backed distributions from real mining** | ~~Инвестируйте в добычу золота и получайте ежедневные вознаграждения в PAXG~~ → **Приобретите токены AYNI и получайте распределения обеспеченные золотом** | ~~Invierte en minería de oro y gana recompensas diarias en PAXG~~ → **Adquiere tokens AYNI y recibe distribuciones respaldadas por oro** |
| Input label | ~~How much would you like to invest?~~ → **Choose your participation amount** | ~~Сколько вы хотите инвестировать?~~ → **Выберите сумму участия** | ~~¿Cuánto deseas invertir?~~ → **Elige el monto de tu participación** |
| Minimum | ~~Minimum investment: $100~~ → **Minimum amount: $100** | ~~Минимальная инвестиция: $100~~ → **Минимальная сумма: $100** | ~~Inversión mínima: $100~~ → **Monto mínimo: $100** |
| Projection label | ~~Estimated earnings for 12 months~~ → **Projected distributions for 12 months** | ~~Предполагаемый доход за 12 месяцев~~ → **Прогноз распределений за 12 месяцев** | ~~Ganancias estimadas para 12 meses~~ → **Distribuciones proyectadas para 12 meses** |
| Rate | ~~~17.5% annual return~~ → **~17.5% est. annual distribution rate** | ~~~17.5% годовая доходность~~ → **~17.5% расчётная годовая ставка распределения** | ~~~17.5% retorno anual~~ → **~17.5% tasa de distribución anual est.** |
| Monthly | ~~Monthly: ~$7.29~~ → **Monthly distribution: ~$7.29** | ~~Ежемесячно: ~$7.29~~ → **Ежемес. распределение: ~$7.29** | ~~Mensual: ~$7.29~~ → **Distribución mensual: ~$7.29** |
| Daily | ~~Daily: ~$0.24~~ → **Daily distribution: ~$0.24** | ~~Ежедневно: ~$0.24~~ → **Ежедн. распределение: ~$0.24** | ~~Diario: ~$0.24~~ → **Distribución diaria: ~$0.24** |
| CTA button | ~~Invest $500 and start earning~~ → **Get $500 in AYNI and activate** | ~~Инвестировать $500 и начать зарабатывать~~ → **Получить AYNI на $500 и активировать** | ~~Invertir $500 y empezar a ganar~~ → **Obtener $500 en AYNI y activar** |
| Auto-stake desc | ~~Your investment starts working immediately~~ → **Your tokens start accruing rewards immediately** | ~~Ваша инвестиция начнёт работать сразу~~ → **Ваши токены начнут приносить вознаграждения сразу** | ~~Tu inversión empieza a trabajar de inmediato~~ → **Tus tokens comienzan a acumular recompensas de inmediato** |
| How It Works step 1 | ~~Invest~~ → **Participate** | ~~Инвестируйте~~ → **Участвуйте** | ~~Invierte~~ → **Participa** |
| Step 1 desc | ~~Choose how much you want to invest, starting from $100~~ → **Choose your amount starting from $100** | ~~Выберите сумму от $100~~ → **Выберите сумму от $100** | ~~Elige cuánto invertir, desde $100~~ → **Elige tu monto desde $100** |
| Step 3 desc | ~~Receive gold-backed rewards daily, paid out quarterly~~ → **Gold-backed distributions accrue daily, paid quarterly** | ~~Получайте вознаграждения ежедневно, выплаты ежеквартально~~ → **Распределения начисляются ежедневно, выплаты ежеквартально** | ~~Recibe recompensas diarias, pagadas trimestralmente~~ → **Las distribuciones se acumulan diariamente, pagadas trimestralmente** |

---

### 4. CHECKOUT

| Элемент | EN | RU | ES |
|---|---|---|---|
| Title | ~~Order summary~~ → **Order summary** (ок) | ~~Итого~~ → оставить | ~~Resumen~~ → оставить |
| Row 1 | ~~Investment amount~~ → **Participation amount** | ~~Сумма инвестиции~~ → **Сумма участия** | ~~Monto de inversión~~ → **Monto de participación** |
| Rate row | ~~Estimated annual return~~ → **Est. annual distribution rate** | ~~Годовая доходность~~ → **Расч. годовая ставка распределения** | ~~Retorno anual estimado~~ → **Tasa de distribución anual est.** |

---

### 5. POSITIONS PAGE (бывший Portfolio)

| Элемент | EN | RU | ES |
|---|---|---|---|
| Page title | ~~Your Portfolio~~ → **Your Positions** | ~~Ваш Портфель~~ → **Ваши Позиции** | ~~Tu Portafolio~~ → **Tus Posiciones** |
| Main card label | ~~PORTFOLIO VALUE~~ → **POSITION VALUE** | ~~СТОИМОСТЬ ПОРТФЕЛЯ~~ → **СТОИМОСТЬ ПОЗИЦИЙ** | ~~VALOR DEL PORTAFOLIO~~ → **VALOR DE POSICIONES** |
| Sub label | ~~All time earned~~ → **All time received** | ~~Всего заработано~~ → **Всего получено** | ~~Total ganado~~ → **Total recibido** |
| Position card | ~~Invested: $146~~ → **Participation: $146** | ~~Инвестировано: $146~~ → **Участие: $146** | ~~Invertido: $146~~ → **Participación: $146** |
| Position card | ~~Earned: 0.00065 PAXG~~ → **Distributed: 0.00065 PAXG** | ~~Заработано: 0.00065 PAXG~~ → **Начислено: 0.00065 PAXG** | ~~Ganado: 0.00065 PAXG~~ → **Distribuido: 0.00065 PAXG** |
| Reinvest button | ~~Reinvest~~ → **Restake** | ~~Реинвестировать~~ → **Рестейкнуть** | ~~Reinvertir~~ → **Restakear** |
| After unlock text | ~~When your staking period ends...~~ → тот же текст, но без "investment" | аналогично | аналогично |
| Completed card | ~~What's next?~~ → оставить | ~~Что дальше?~~ → оставить | ~~¿Qué sigue?~~ → оставить |

---

### 6. ACTIVITY PAGE

| Элемент | EN | RU | ES |
|---|---|---|---|
| Filter tab | ~~earnings~~ → **distributions** | ~~доходы~~ → **начисления** | ~~ganancias~~ → **distribuciones** |
| Activity: invest | ~~Invested $500~~ → **Acquired $500 in AYNI** | ~~Инвестировано $500~~ → **Приобретено AYNI на $500** | ~~Invertido $500~~ → **Adquirido $500 en AYNI** |
| Activity: reinvest | ~~Reinvested Rewards~~ → **Restaked Rewards** | ~~Реинвестированы вознаграждения~~ → **Рестейкнуты вознаграждения** | ~~Reinvertidas las recompensas~~ → **Restakeadas las recompensas** |

---

### 7. ONBOARDING

| Шаг | EN | RU | ES |
|---|---|---|---|
| Step 1 title | ~~You invest~~ → **You participate** | ~~Вы инвестируете~~ → **Вы участвуете** | ~~Tú inviertes~~ → **Tú participas** |
| Step 1 desc | ~~Choose amount starting from $100. Pay by card or crypto~~ → **Acquire AYNI tokens from $100. Pay by card or crypto** | ~~Выберите сумму от $100. Оплата картой или криптой~~ → **Приобретите токены AYNI от $100. Оплата картой или криптой** | ~~Elige un monto desde $100. Paga con tarjeta o crypto~~ → **Adquiere tokens AYNI desde $100. Paga con tarjeta o crypto** |
| Step 4 title | ~~You earn PAXG~~ → **You receive PAXG** | ~~Вы зарабатываете PAXG~~ → **Вы получаете PAXG** | ~~Ganas PAXG~~ → **Recibes PAXG** |
| Step 4 desc | ~~Receive gold-backed rewards daily~~ → **Gold-backed distributions accrue daily, paid quarterly** | ~~Получайте вознаграждения ежедневно~~ → **Начисления ежедневно, выплаты ежеквартально** | ~~Recibe recompensas diarias~~ → **Distribuciones diarias, pagadas trimestralmente** |

---

### 8. SETTINGS

| Элемент | EN | RU | ES |
|---|---|---|---|
| Notification label | ~~Email: Rewards~~ → оставить | аналогично | аналогично |
| Display currency | оставить | оставить | оставить |

---

### 9. LEARN PAGE (если есть статьи)

| Элемент | EN | RU | ES |
|---|---|---|---|
| Article: how to sell | оставить | оставить | оставить |
| Category name | ~~earning~~ → **distributions** | ~~заработок~~ → **начисления** | ~~ganancias~~ → **distribuciones** |

---

### 10. DISCLAIMERS (добавить/обновить)

На каждом экране где есть цифры (проекции, ставки, суммы).

**Short — под калькулятором на Earn page:**

EN: "Projections based on current mining output and gold prices. Distributions are protocol-based and not guaranteed. AYNI is a utility token."

RU: "Прогнозы основаны на текущих показателях добычи и ценах золота. Распределения рассчитываются по протоколу и не гарантированы. AYNI — утилитарный токен."

ES: "Las proyecciones se basan en la producción minera actual y los precios del oro. Las distribuciones son basadas en el protocolo y no están garantizadas. AYNI es un token de utilidad."

**Medium — на Checkout:**

EN: "You are acquiring AYNI utility tokens. Distributions are calculated from independently reported gold production data and are not guaranteed. Past distributions are not indicative of future results."

RU: "Вы приобретаете утилитарные токены AYNI. Распределения рассчитываются на основе независимых данных о добыче золота и не гарантированы. Прошлые распределения не являются показателем будущих результатов."

ES: "Estás adquiriendo tokens de utilidad AYNI. Las distribuciones se calculan a partir de datos de producción de oro reportados independientemente y no están garantizadas. Las distribuciones pasadas no son indicativas de resultados futuros."

**Footer — на Earn page:**

EN: "AYNI TOKEN INC. does not provide financial, investment, or tax advice. Participating in the AYNI platform involves risk, including possible loss of your participation amount. Consult a qualified professional before participating."

RU: "AYNI TOKEN INC. не предоставляет финансовых, инвестиционных или налоговых консультаций. Участие в платформе AYNI связано с рисками, включая возможную потерю суммы участия. Проконсультируйтесь со специалистом."

ES: "AYNI TOKEN INC. no proporciona asesoramiento financiero, de inversión ni fiscal. Participar en la plataforma AYNI conlleva riesgos, incluyendo la posible pérdida del monto de participación. Consulte a un profesional calificado."

---

## ПОРЯДОК РАБОТЫ

1. Найди все файлы локализации / i18n (json, ts, или hardcoded строки)
2. Глобальный поиск: `grep -ri "invest" src/` → заменить по таблице (EN)
3. Глобальный поиск: `grep -ri "инвестир" src/` → заменить по таблице (RU)
4. Глобальный поиск: `grep -ri "invertir\|inversión" src/` → заменить по таблице (ES)
5. Аналогично для: earn/earned/earnings, portfolio, profit, return, income
6. Обнови роутер: /portfolio → /positions (+ redirect)
7. Обнови навигацию: label "Portfolio" → "Positions" на всех 3 языках
8. Добавь disclaimers на Earn, Checkout
9. Проверь что ни одна UI-строка не содержит запрещённых слов

## ФИНАЛЬНАЯ ПРОВЕРКА

После всех замен выполни:

```bash
# Не должно быть результатов (кроме имён переменных в .ts/.tsx, которые ок):
grep -rn '"[^"]*[Ii]nvest[^o][^r]' src/ --include="*.json"
grep -rn '"[^"]*[Ii]nvest[^o][^r]' src/ --include="*.ts" | grep -v "interface\|type\|const\|import"
grep -rn 'инвестир' src/
grep -rn 'invertir\|inversión' src/
grep -rn '"[^"]*[Pp]ortfolio' src/ --include="*.json"
grep -rn '"[^"]*[Pp]ортфел' src/
grep -rn '"[^"]*[Pp]ortafolio\|[Cc]artera' src/
grep -rn '"[^"]*[Pp]rofit\|[Pp]рибыл\|[Gg]anancia' src/ --include="*.json"
```

Все совпадения в UI-facing строках — исправить.
```
