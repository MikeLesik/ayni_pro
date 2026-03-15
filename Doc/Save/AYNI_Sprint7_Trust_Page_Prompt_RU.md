# SPRINT 7: Раздел «Доверие» — отдельная страница /trust

## Задача для Claude Code

```
## Задача: Создать отдельный раздел "Trust" (/trust) и перенести trust-контент из Learn

### Контекст

По результатам UX-аудита, trust-контент был ошибочно размещён внутри раздела Learn. 
Это неправильно: Learn отвечает на "как это работает?", Trust — на "почему вам верить?".
Пользователь, который сомневается, не пойдёт в раздел обучения — ему нужна отдельная 
точка входа с доказательствами.

На внешнем сайте ayni.gold уже существует Trust-страница с контентом о Mineralis, аудитах, 
Scoping Study. Задача — перенести и расширить этот контент внутрь дашборда как 
полноценный раздел.

### Что сделать

1. Создать новую страницу /trust со своим роутом и компонентами
2. Перенести ВСЕ trust-контент из Learn в /trust (карточки, proof of mining, FAQ по доверию)
3. На Learn оставить только обучающий контент (видео, FAQ по механике, how it works)
4. Добавить "Trust" в навигацию
5. Обновить все внутренние ссылки

---

### Часть 1: Навигация — где разместить Trust

Текущая навигация: Home | Earn | Positions | My Mine | Activity | Learn

Новая навигация: Home | Earn | Positions | My Mine | Activity | Learn | Trust

Реализация:
- Desktop NavBar: добавить "Trust" как последний пункт перед ценами AYNI/PAXG
  Иконка: ShieldCheck (Lucide), label: "Trust"
  Стиль: идентичен остальным nav items
  
- Mobile TabBar (5 пунктов max): Trust НЕ влезает в tab bar.
  Решение: в мобильном "More" (последний таб) добавить пункт "Trust" в dropdown/sheet
  ИЛИ: заменить мобильную структуру: Home | Earn | Positions | Activity | More
  Где "More" содержит: My Mine, Learn, Trust, Settings
  
- В NavBar на Desktop при ограниченном пространстве: можно сгруппировать Learn и Trust 
  в dropdown "Resources" → { Learn, Trust }
  Но предпочтительнее: отдельные пункты, т.к. Trust — ключевая точка конверсии

---

### Часть 2: Структура страницы /trust

Файл: `src/pages/TrustPage.tsx`

Wireframe страницы (сверху вниз):

```
[PAGE HEADER]
  "Trust & Transparency" — heading-1 (DM Serif Display)
  "See exactly how your participation works — from the mine to your wallet"
  — body-lg, --text-secondary

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 1: LIVE STATUS BANNER] — bg: --color-bg-secondary, radius-xl, p-24
  
  Горизонтальная полоска с ключевыми метриками:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │  🟢 Mining Active          Total Participants    Concession     │
  │  San Hilario, Madre de     XXX participants      8 km²          │
  │  Dios, Peru                                      Madre de Dios  │
  │                                                                 │
  │  Operating Since            Equipment             Licensed       │
  │  2023                       16 units              INGEMMET       │
  │                                                   #070011405    │
  └─────────────────────────────────────────────────────────────────┘
  
  - Desktop: flex-row, 6 метрик в ряд
  - Mobile: grid 2×3 или flex-wrap
  - "Mining Active" с зелёной точкой (animate: pulse)
  - Все метрики: label-sm (верх, muted) + number-md или body-md bold (низ)

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 2: MINERALES SAN HILARIO] — mt-40

  "Mining Partner" — heading-2
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                 │
  │  [ФОТО/КАРУСЕЛЬ]                [ИНФО-БЛОК]                    │
  │  3-5 фото с концессии           Minerales San Hilario S.C.R.L. │
  │  (placeholder-слоты              heading-3                      │
  │   если фото нет)                                                │
  │                                  Licensed gold mining company   │
  │  ← Carousel с dots ─→           based in Peru. Established in  │
  │                                  2023. Operates under official  │
  │                                  concession license #070011405  │
  │                                  issued by INGEMMET.            │
  │                                                                 │
  │                                  Location: Madre de Dios, Peru  │
  │                                  Area: 8 km² alluvial concession│
  │                                  Coordinates: 12°48'37"S,       │
  │                                  70°27'36"W                     │
  │                                                                 │
  │                                  [See Registration →]           │
  │                                  (внешняя ссылка на INGEMMET)   │
  └─────────────────────────────────────────────────────────────────┘
  
  Desktop: 2 колонки (фото 50% | инфо 50%)
  Mobile: стек (фото сверху, инфо снизу)

  [EQUIPMENT GRID] — mt-24, внутри секции Minerales
  
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ 🚜 Excavators │ │ 🚛 Loaders   │ │ 🚚 Dump trucks│
  │ 6 units       │ │ 3 units      │ │ 3 units       │
  └──────────────┘ └──────────────┘ └──────────────┘
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ ⚙️ Trommels   │ │ 🏗️ Gold sep.  │ │ 🏠 Facilities │
  │ 4 scrubber    │ │ Gravity-based│ │ On-site       │
  │ units         │ │ full equip.  │ │ residential   │
  └──────────────┘ └──────────────┘ └──────────────┘
  
  - Grid 3×2 (desktop) / 2×3 (mobile)
  - Каждая: bg surface-card, radius-lg, p-16, иконка + число + подпись

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 3: SCOPING STUDY] — mt-40

  "Technical Foundation" — heading-2
  
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                 │
  │  [ОБЛОЖКА SCOPING STUDY]        [КЛЮЧЕВЫЕ ФАКТЫ]               │
  │  Изображение обложки            Phase 1 Scoping Study          │
  │  EUCu. Scoping Study            Minerales San Hilario SRL      │
  │  Minerales San Hilario          May 2025                       │
  │  May 2025                                                       │
  │                                  Ключевые данные:               │
  │                                  • Площадь: 8 km²              │
  │                                  • Глубина оценки: до 5м       │
  │                                  • Средний грейд: 0.186 g/t    │
  │                                  • Потенциал: ~344,000 oz       │
  │                                    извлекаемого золота          │
  │                                  • Recovery rate: 80%           │
  │                                                                 │
  │                                  Verified by:                   │
  │                                  Timothy Strong BSc (Hons)      │
  │                                  Kangari Consulting LLC          │
  │                                  NI 43-101 qualified, 15+ years │
  │                                                                 │
  │                                  Liam Hardy BSc (Hons)          │
  │                                  European Copper (EUCu.)        │
  │                                  12 years mineral exploration   │
  │                                                                 │
  │                                  [Read Full Report →] (PDF)     │
  │                                  [Access Scoping Study →] (PDF) │
  └─────────────────────────────────────────────────────────────────┘
  
  DISCLAIMER (body-sm, text-muted, italic):
  "This is a conceptual exploration target, not a compliant mineral resource estimate. 
   It serves as a planning reference for future drilling and evaluation."

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 4: PROOF OF MINING — ЕЖЕНЕДЕЛЬНЫЙ ОТЧЁТ] — mt-40

  "Mining Operations" — heading-2
  
  ┌─────────────────────────────────────────────────────────────────┐
  │  LATEST PRODUCTION REPORT                                       │
  │  Week of Feb 24 – Mar 2, 2026                  [View full →]   │
  │                                                                 │
  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
  │  │Gold output  │ │Op. hours   │ │Utilization │ │Sediment    │  │
  │  │ 12.4g       │ │ 168h       │ │ 92%        │ │ 2,400 m³   │  │
  │  │ this week   │ │ this week  │ │ efficiency │ │ processed  │  │
  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
  │                                                                 │
  │  [📸 Site photos this week]                                     │
  │  Карусель из 3-5 фото (placeholder если нет реальных)           │
  │                                                                 │
  │  [📹 Latest video update — Feb 15, 2026]                        │
  │  Embedded video или placeholder                                 │
  └─────────────────────────────────────────────────────────────────┘

  Данные: из мока `src/services/mock/data/trust.ts` 
  В будущем: из API GET /api/trust/mining-report
  
  Placeholder-режим (если нет реальных данных):
  - Показать последний доступный мок-отчёт
  - Фото: серые placeholder с иконкой Camera + "Site photos coming soon"
  - Видео: placeholder с иконкой Play + "Video update coming soon"

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 5: SECURITY AUDITS] — mt-40

  "Fully Audited Web3 Infrastructure" — heading-2
  
  ┌──────────────────────────────┐ ┌──────────────────────────────┐
  │  [PeckShield Logo/Badge]     │ │  [CertiK Logo/Badge]         │
  │                              │ │                              │
  │  PeckShield Security Audit   │ │  CertiK Smart Contract Audit │
  │  Status: ✅ Passed           │ │  Status: ✅ Passed           │
  │                              │ │                              │
  │  [View Report →]             │ │  [View Audit →]              │
  │  (ссылка на PDF)             │ │  [CertiK Page →]            │
  └──────────────────────────────┘ └──────────────────────────────┘
  
  [TOKEN INFO] — mt-16, bg surface-card, radius-lg, p-20
  ┌─────────────────────────────────────────────┐
  │  Token name      Ayni Gold                   │
  │  Symbol          AYNI                        │
  │  Standard        ERC-20                      │
  │  Total supply    806,451,613                 │
  │  Contract        0x... [Copy] [Etherscan →]  │
  └─────────────────────────────────────────────┘
  
  - Адрес контракта: кнопка Copy (Lucide: Copy icon) + внешняя ссылка на Etherscan
  - Вся секция сделана clickable-ссылками, не пустыми бейджами

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 6: LEGAL ENTITIES] — mt-40

  "Legal Structure" — heading-2
  
  Две карточки рядом:
  
  ┌──────────────────────────────┐ ┌──────────────────────────────┐
  │  AYNI TOKEN INC.             │ │  Minerales San Hilario       │
  │                              │ │  S.C.R.L.                    │
  │  International Business      │ │                              │
  │  Company (IBC)               │ │  Registered mining company   │
  │                              │ │  under Peruvian law          │
  │  Jurisdiction: British       │ │                              │
  │  Virgin Islands              │ │  RUC: 20606465255            │
  │  Company #: 2174797          │ │  Registered: Aug 17, 2023    │
  │                              │ │  Concession: #070011405      │
  │  Address: 19 Waterfront      │ │  Authority: INGEMMET         │
  │  Drive, P.O. Box 3540,      │ │                              │
  │  Road Town, Tortola,         │ │  Location: Madre de Dios,    │
  │  VG1110, BVI                 │ │  Peru (12°48'S, 70°27'W)    │
  │                              │ │                              │
  │  [View Terms →]              │ │  [See Registration →]        │
  └──────────────────────────────┘ └──────────────────────────────┘
  
  - Desktop: 2 колонки
  - Mobile: стек
  - Карточки: bg surface-card, radius-xl, p-24, border-left 3px (AYNI: --color-primary, Mineralis: --color-gold)

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 7: HOW VALUE FLOWS] — mt-40

  "How Your Participation Works" — heading-2
  
  Интерактивная диаграмма 6 шагов:
  
  [Your $] → [Buy AYNI] → [Mining Operations] → [Gold Extracted] → [Convert to PAXG] → [Your Wallet]
  
  Каждый шаг — кликабельная карточка:
  
  Шаг 1: иконка DollarSign
    "Participate" / "You choose an amount starting from $100"
    
  Шаг 2: иконка Coins  
    "Acquire AYNI" / "Tokens represent your share of mining capacity (1 AYNI = 4 cm³/hour)"
    
  Шаг 3: иконка Pickaxe
    "Mining" / "Minerales SH operates 16h/day with industrial equipment in Madre de Dios, Peru"
    
  Шаг 4: иконка Scale
    "Gold Extracted" / "Real gold is extracted from alluvial sediments, measured in grams"
    
  Шаг 5: иконка RefreshCw
    "Convert to PAXG" / "Gold output is converted to PAXG — a token backed 1:1 by physical gold (Paxos)"
    
  Шаг 6: иконка Wallet
    "Your Distributions" / "PAXG accrues daily, paid out quarterly. Withdraw in PAXG or USD."
  
  ВАЖНО: этот компонент — тот же ValueFlowSection из Sprint 2, но теперь размещается 
  на Trust-странице как основное место. На Learn-странице можно оставить упрощённую версию 
  или ссылку "See how it works → /trust#how-it-works".
  
  Desktop: горизонтальный flow с стрелками
  Mobile: вертикальный flow со стрелками вниз
  id="how-it-works" для якорных ссылок

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 8: STABILITY FUND] — mt-40 (если данные доступны)

  "Stability Fund" — heading-2
  
  ┌─────────────────────────────────────────────────────────────────┐
  │  We maintain a reserve fund to ensure consistent distributions  │
  │                                                                 │
  │  Fund size         $XXX,XXX                                     │
  │  Source             20-30% of token sales                       │
  │  Purpose            Smooth distributions during operational     │
  │                     pauses or maintenance periods                │
  │                                                                 │
  │  [View on-chain →] (ссылка на адрес кошелька стабфонда)        │
  └─────────────────────────────────────────────────────────────────┘

  Если данных по стабфонду пока нет — скрыть секцию или показать placeholder:
  "Stability fund is being established. Details will appear here."

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 9: RISK DISCLOSURE] — mt-40

  "Important Disclosures" — heading-2
  
  Прозрачная таблица рисков:
  
  | Риск | Описание | Митигация |
  |------|----------|-----------|
  | Mining output variability | Gold production varies by geological conditions, weather, equipment | Diversification across mining zones, equipment maintenance schedule |
  | Gold price volatility | PAXG value tied to gold spot price | Distributions in gold-backed token, not speculative asset |
  | Token price risk | AYNI price determined by market | Token is utility instrument, not speculative vehicle |
  | Regulatory risk | Crypto regulation evolving | BVI incorporation, Peruvian mining license compliance |
  | Operational risk | Equipment failure, access disruption | Stability fund, maintenance program, backup equipment |
  | Liquidity risk | Limited DEX liquidity | Focus on long-term participation, not trading |
  
  + Полный дисклеймер внизу:
  "AYNI TOKEN INC. does not provide financial, investment, or tax advice. Participating in 
  the AYNI platform involves risk, including possible loss of your participation amount. 
  Past distributions are not indicative of future results. Consult a qualified professional 
  before participating."
  
  Стиль: bg surface-card, radius-xl, p-24, text body-sm

═══════════════════════════════════════════════════════════════════

[СЕКЦИЯ 10: TRUST FAQ] — mt-40

  "Questions About Trust & Safety" — heading-2
  
  Accordion — перенести сюда trust-FAQ, которые сейчас в Learn:
  
  - "Is the mining project officially licensed?"
    → Ответ: да, лицензия INGEMMET #070011405, ссылка на Registration
    
  - "Who verified the technical data?"
    → Timothy Strong (Kangari Consulting, NI 43-101) + Liam Hardy (EUCu., 12 лет опыта)
    
  - "How much gold potential does the project offer?"
    → ~344,000 oz recoverable (conceptual, not formal MRE), Scoping Study May 2025
    
  - "Where can I read the full technical report?"
    → Ссылка на Scoping Study PDF
    
  - "Where can I verify on-chain?"
    → Contract address + Etherscan link + PeckShield/CertiK links
    
  - "What blockchain is AYNI on?"
    → ERC-20 on Ethereum mainnet
    
  - "What is the token contract address?"
    → Address + Copy button
    
  - "How is environmental responsibility handled?"
    → Phytoremediation plans, agroforestry, cacao production zone (из Homepage)
    
  - "Who are the legal entities behind AYNI?"
    → AYNI TOKEN INC. (BVI) + Minerales SH (Peru) — с ссылками на регистрации

═══════════════════════════════════════════════════════════════════

[FOOTER CTA] — mt-40, bg --color-primary, radius-xl, p-32, text-white

  "Ready to start?" — heading-2, white
  "Join XXX participants earning gold-backed distributions"
  [Get Started →] — CTA button, gold variant, → /earn

```

---

### Часть 3: Что убрать/изменить в Learn

Файл: `src/pages/LearnPage.tsx`

После создания Trust-страницы, Learn должен содержать ТОЛЬКО обучающий контент:

ОСТАВИТЬ в Learn:
- Видео-карточки "Getting started" (How it works, Your first participation, Understanding your distributions)
- FAQ по МЕХАНИКЕ продукта (не по доверию):
  - "What is AYNI and how does it work?"
  - "How are my distributions calculated?"
  - "When do I receive my payouts?"
  - "How do I withdraw my distributions?"
  - "What is PAXG?"
  - "How to sell your AYNI tokens"
  - "Understanding AYNI token price"
- "How your participation works" — упрощённая диаграмма (Participate → Mining → Gold → PAXG → Wallet)
  Внизу: "For detailed transparency information, see our [Trust & Transparency →] page"
- Search, контакты (Email support, Live chat, Documentation)

ПЕРЕНЕСТИ из Learn в Trust:
- Карточки "Mining Partner", "Security Audits", "Legal Entity", "Real Operations" (из Sprint 6)
- Proof of Mining секцию (из Sprint 6)
- FAQ вопросы про доверие:
  - "Is my participation safe?" → перенести в Trust FAQ
  - "Where can I verify on-chain?" → Trust FAQ
  - "What is the token contract address?" → Trust FAQ
  - Все вопросы про лицензии, аудиты, юрлица → Trust FAQ
- "Backed by real mining" баннер/секция → Trust
- Ссылки на PeckShield/CertiK → Trust

ДОБАВИТЬ в Learn (ссылки на Trust):
- Под секцией "How your participation works": 
  баннер-ссылка → "Want to see proof? Visit Trust & Transparency →" 
  Стиль: bg --color-gold-light, p-16, radius-lg, flex с иконкой ShieldCheck + текст + стрелка

---

### Часть 4: Обновить внутренние ссылки

Все ссылки, которые раньше вели на /learn#trust, теперь ведут на /trust:

1. Home: бейдж "Backed by real mining" → onClick: navigate('/trust')
2. Earn: trust-бейджи (PeckShield, Certik, Licensed Mining, Funds Protected):
   - PeckShield → /trust#audits или внешняя ссылка на PDF
   - Certik → /trust#audits или внешняя ссылка
   - Licensed Mining → /trust#mining-partner
   - Funds Protected → /trust#stability-fund
3. Earn: "Participating with more than $5,000? Contact our team →" — оставить как есть
4. ValueFlowTooltip (Sprint 2): ссылка "Подробнее →" → /trust#how-it-works
5. Positions: любые trust-ссылки → /trust
6. Onboarding: если есть упоминания trust → /trust

---

### Часть 5: Мок-данные

Файл: `src/services/mock/data/trust.ts`

```typescript
export const trustData = {
  miningStatus: {
    status: 'active' as const,  // 'active' | 'maintenance' | 'paused'
    location: 'San Hilario, Madre de Dios, Peru',
    coordinates: { lat: -12.8103, lng: -70.4600 },
    concessionArea: '8 km²',
    operatingSince: '2023',
    licenseNumber: '070011405',
    authority: 'INGEMMET',
  },
  
  equipment: [
    { name: 'Excavators', count: 6, icon: 'Truck' },
    { name: 'Loaders', count: 3, icon: 'Container' },
    { name: 'Dump trucks', count: 3, icon: 'Truck' },
    { name: 'Scrubber-trommel units', count: 4, icon: 'Settings' },
    { name: 'Gold separation equipment', count: 1, description: 'Gravity-based, full set', icon: 'Filter' },
    { name: 'Residential facilities', count: 1, description: 'On-site for operational teams', icon: 'Home' },
  ],
  
  scopingStudy: {
    title: 'Phase 1 Scoping Study',
    author: 'EUCu. (European Copper)',
    date: 'May 2025',
    area: '8 km²',
    depth: '5m',
    averageGrade: '0.186 g/t',
    potentialGold: '~344,000 oz recoverable',
    recoveryRate: '80%',
    verifiers: [
      {
        name: 'Timothy Strong BSc (Hons) ACSM MIMMM QMR RSci MBA',
        company: 'Kangari Consulting LLC',
        qualification: 'NI 43-101 qualified, 15+ years experience',
      },
      {
        name: 'Liam Hardy BSc (Hons)',
        company: 'European Copper (EUCu.)',
        qualification: '12 years mineral exploration',
      },
    ],
    reportUrl: '/documents/scoping-study.pdf',  // или внешняя ссылка
  },
  
  latestReport: {
    period: 'Feb 24 – Mar 2, 2026',
    goldOutput: '12.4g',
    operatingHours: '168h',
    utilization: '92%',
    sedimentProcessed: '2,400 m³',
    photos: [],  // пустой массив — покажет placeholder
    videoUrl: null,  // null — покажет placeholder
  },
  
  audits: [
    {
      name: 'PeckShield',
      status: 'passed',
      reportUrl: 'https://...peckshield-report.pdf',
      logoComponent: 'PeckShieldLogo',  // или URL логотипа
    },
    {
      name: 'CertiK',
      status: 'passed',
      auditUrl: 'https://...certik-audit.pdf',
      pageUrl: 'https://www.certik.com/projects/ayni',
      logoComponent: 'CertikLogo',
    },
  ],
  
  token: {
    name: 'Ayni Gold',
    symbol: 'AYNI',
    standard: 'ERC-20',
    totalSupply: '806,451,613',
    contractAddress: '0x...', // реальный адрес контракта
    etherscanUrl: 'https://etherscan.io/token/0x...',
  },
  
  entities: {
    ayniTokenInc: {
      name: 'AYNI TOKEN INC.',
      type: 'International Business Company (IBC)',
      jurisdiction: 'British Virgin Islands',
      companyNumber: '2174797',
      address: '19 Waterfront Drive, P.O. Box 3540, Road Town, Tortola, VG1110, BVI',
    },
    mineralesSH: {
      name: 'Minerales San Hilario S.C.R.L.',
      type: 'Registered mining company under Peruvian law',
      ruc: '20606465255',
      registered: 'August 17, 2023',
      concession: '#070011405',
      authority: 'INGEMMET',
      location: 'Madre de Dios, Peru',
    },
  },
  
  stabilityFund: null,  // null = скрыть секцию, или { size: 142000, source: '20-30%', ... }
  
  participants: 'XXX',  // заменить реальным числом
};
```

---

### Часть 6: Роутинг

В файле роутера (App.tsx или router.ts):

```typescript
// Добавить роут
{ path: '/trust', element: <TrustPage /> }
```

---

### Часть 7: Компонентная структура

Создать файлы:

```
src/
  pages/
    TrustPage.tsx                    — основная страница
  components/
    trust/
      TrustHero.tsx                  — заголовок + подзаголовок
      MiningStatusBanner.tsx         — live status с метриками
      MineralesSection.tsx           — фото + инфо + equipment grid
      ScopingStudySection.tsx        — обложка + ключевые факты + верификаторы
      ProofOfMiningSection.tsx       — еженедельный отчёт + фото + видео
      AuditsSection.tsx              — PeckShield + CertiK + token info
      LegalEntitiesSection.tsx       — AYNI TOKEN INC + Minerales SH
      ValueFlowDiagram.tsx           — перенести/переиспользовать из Sprint 2
      StabilityFundSection.tsx       — стабфонд (conditional render)
      RiskDisclosureSection.tsx      — таблица рисков + дисклеймер
      TrustFaq.tsx                   — accordion с trust-вопросами
      TrustCtaBanner.tsx             — нижний CTA
      PhotoCarousel.tsx              — карусель фото (reusable)
      PlaceholderMedia.tsx           — placeholder для фото/видео
      index.ts
  services/
    mock/
      data/
        trust.ts                     — мок-данные (см. выше)
```

---

### Часть 8: Стилизация

Общие правила:
- Типографика: DM Serif Display для heading-1, heading-2. Inter для body.
- Цвета: design tokens из проекта (--color-primary, --color-gold, --color-bg-primary и т.д.)
- Карточки: bg surface-card, radius-xl, shadow-sm, p-24
- Секции: mt-40 между собой, max-w-[960px] mx-auto
- Responsive: mobile-first, breakpoint 768px для 2-column layouts
- Accent: секция Minerales — левый border gold, секция Audits — левый border primary
- Фото-placeholder: bg --color-bg-secondary, radius-lg, aspect-ratio 16/9, 
  flex center, иконка Camera (Lucide, 48px, --text-muted)
- Dark mode: все через CSS variables, проверить contrast

---

### Часть 9: Валидация

После реализации:

- [ ] /trust загружается без ошибок
- [ ] NavBar содержит пункт "Trust" (desktop)
- [ ] Mobile: Trust доступен через "More" меню
- [ ] Все секции рендерятся с мок-данными
- [ ] Фото-placeholder отображаются корректно (пока нет реальных фото)
- [ ] Ссылки PeckShield/CertiK кликабельны (ведут на отчёты)
- [ ] Contract address имеет кнопку Copy
- [ ] Trust FAQ — все вопросы раскрываются
- [ ] Learn: trust-контент УДАЛЁН, остался только обучающий
- [ ] Learn: есть баннер-ссылка на /trust
- [ ] Home: "Backed by real mining" → navigate('/trust')
- [ ] Earn: trust-бейджи → ведут на /trust#audits
- [ ] ValueFlowTooltip: "Подробнее →" → /trust#how-it-works
- [ ] Все тексты через i18n (EN/RU/ES)
- [ ] Dark mode: все секции корректны
- [ ] Mobile: все секции стекаются вертикально
- [ ] Risk disclosure table: responsive (горизонтальный скролл на mobile)
- [ ] Compliance: нет слов "invest", "reward", "earning" на странице
```
