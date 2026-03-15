export const trustData = {
  miningStatus: {
    status: 'active' as const,
    location: 'San Hilario, Madre de Dios, Peru',
    coordinates: { lat: -12.8103, lng: -70.46 },
    concessionArea: '8 km\u00B2',
    operatingSince: '2023',
    licenseNumber: '070011405',
    authority: 'INGEMMET',
    totalParticipants: 47,
    equipmentUnits: 16,
  },

  miningStatusRosemary: {
    status: 'acquired' as const,
    name: 'Rosemary Uno',
    location: 'Madre de Dios, Peru',
    concessionArea: 'TBD',
    acquired: 'Q4 2025',
    phase: 'Pre-development',
    authority: 'INGEMMET',
  },

  equipment: [
    { name: 'Excavators', count: 6, icon: 'Truck' as const },
    { name: 'Loaders', count: 3, icon: 'Container' as const },
    { name: 'Dump trucks', count: 3, icon: 'Truck' as const },
    { name: 'Scrubber-trommel units', count: 4, icon: 'Settings' as const },
    {
      name: 'Gold separation equipment',
      count: 1,
      description: 'Gravity-based, full set',
      icon: 'Filter' as const,
    },
    {
      name: 'Residential facilities',
      count: 1,
      description: 'On-site for operational teams',
      icon: 'Home' as const,
    },
  ],

  scopingStudy: {
    title: 'Phase 1 Scoping Study',
    author: 'EUCu. (European Copper)',
    date: 'May 2025',
    area: '8 km\u00B2',
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
    reportUrl: '#',
  },

  miningOperations: {
    period: 'Jul – Dec 2025',
    totalExtracted: 7883.5,
    totalSold: 7482.5,
    monthly: [
      { month: '2025-07', label: 'Jul 2025', extracted: 1312.0, sold: 1196.7 },
      { month: '2025-08', label: 'Aug 2025', extracted: 1426.3, sold: 1425.2 },
      { month: '2025-09', label: 'Sep 2025', extracted: 602.9, sold: 458.0 },
      { month: '2025-10', label: 'Oct 2025', extracted: 1356.0, sold: 1070.0 },
      { month: '2025-11', label: 'Nov 2025', extracted: 1693.0, sold: 1895.0 },
      { month: '2025-12', label: 'Dec 2025', extracted: 1493.3, sold: 1437.6 },
    ],
    photos: [
      { src: '/src/assets/mining/site-overview.jpeg', alt: 'Mining site aerial overview' },
      { src: '/src/assets/mining/processing-plant.jpeg', alt: 'Gold processing plant' },
      { src: '/src/assets/mining/excavation-site.jpeg', alt: 'Excavation operations' },
    ],
    videoUrl: null as string | null,
  },

  audits: [
    {
      name: 'PeckShield',
      status: 'passed' as const,
      reportUrl: '#',
    },
    {
      name: 'CertiK',
      status: 'passed' as const,
      auditUrl: '#',
      pageUrl: '#',
    },
  ],

  token: {
    name: 'Ayni Gold',
    symbol: 'AYNI',
    standard: 'ERC-20',
    totalSupply: '806,451,613',
    contractAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    etherscanUrl: '#',
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
      coordinates: '12\u00B048\'37"S, 70\u00B027\'36"W',
    },
    rosemaryUno: {
      name: 'Rosemary Uno',
      status: 'acquired' as const,
      acquired: 'Q4 2025',
      location: 'Madre de Dios, Peru',
      authority: 'INGEMMET',
      phase: 'pre-development' as const,
      roadmap: [
        { milestone: 'Concession acquisition', target: 'Q4 2025', completed: true },
        { milestone: 'Engineering & project design', target: 'Q4 2026', completed: false },
        { milestone: 'Equipment procurement', target: 'Q4 2026', completed: false },
        { milestone: 'Installation & trial run', target: '2027', completed: false },
      ],
    },
  },

  reservesSnapshot: {
    lastUpdated: '2025-12-31T00:00:00Z',
    goldReservesGrams: 7883.5,
    goldSoldGrams: 7482.5,
    coverageRatio: 0.949,
    tokenBackingRatio: 1.12,
    nextAuditDate: '2026-03-31',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD1e',
    onChainHolders: 47,
  },

  stabilityFund: null as { size: number; source: string; walletUrl: string } | null,

  risks: [
    {
      risk: 'Mining output variability',
      description: 'Gold production varies by geological conditions, weather, equipment',
      mitigation: 'Diversification across mining zones, equipment maintenance schedule',
    },
    {
      risk: 'Gold price volatility',
      description: 'PAXG value tied to gold spot price',
      mitigation: 'Distributions in gold-backed token, not speculative asset',
    },
    {
      risk: 'Token price risk',
      description: 'AYNI price determined by market',
      mitigation: 'Token is utility instrument, not speculative vehicle',
    },
    {
      risk: 'Regulatory risk',
      description: 'Crypto regulation evolving',
      mitigation: 'BVI incorporation, Peruvian mining license compliance',
    },
    {
      risk: 'Operational risk',
      description: 'Equipment failure, access disruption',
      mitigation: 'Stability fund, maintenance program, backup equipment',
    },
    {
      risk: 'Liquidity risk',
      description: 'Limited DEX liquidity',
      mitigation: 'Focus on long-term participation, not trading',
    },
  ],
};
