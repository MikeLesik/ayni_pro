import type { TranslationKey } from './en';

export const es: Record<TranslationKey, string> = {
  // ── Common ──
  'common.retry': 'Reintentar',
  'common.cancel': 'Cancelar',
  'common.delete': 'Eliminar',
  'common.close': 'Cerrar',
  'common.processing': 'Procesando…',
  'common.comingSoon': 'Próximamente',
  'common.viewAll': 'Ver todo',
  'common.max': 'Máx',
  'common.months': 'meses',
  'common.error': 'Algo salió mal',
  'common.days': 'días',
  'common.perDay': '/día',
  'common.today': 'hoy',

  // ── Status labels ──
  'status.active': 'Activo',
  'status.pending': 'Pendiente',
  'status.completed': 'Completado',
  'status.claimed': 'Reclamado',
  'status.locked': 'Bloqueado',

  // ── Navigation ──
  'nav.home': 'Inicio',
  'nav.earn': 'Earn',
  'nav.portfolio': 'Posiciones',
  'nav.activity': 'Actividad',
  'nav.myMine': 'Mi Concesión',
  'nav.learn': 'Aprender',
  'nav.trust': 'Confianza',
  'nav.more': 'M\u00E1s',
  'nav.settings': 'Ajustes',
  'nav.startEarning': 'Comenzar',
  'nav.premium': 'Premium',
  'nav.participate': 'Participar',
  'nav.resources': 'Recursos',
  'nav.profile': 'Perfil',

  // ── Navigation: Page-level tabs ──
  'portfolio.positionTabs.history': 'Historial',
  'resources.tab.learn': 'Aprender',
  'resources.tab.trust': 'Confianza y transparencia',
  'participate.tab.participate': 'Participar',
  'participate.tab.marketplace': 'Mercado',

  // ── FAB ──
  'fab.ariaLabel': 'Contactar a su asesor personal',

  // ── Home ──
  'home.heroCard.totalEarned': 'Total Recibido',
  'home.heroCard.totalAccrued': 'Total Acumulado',
  'home.heroCard.sinceYouStarted': 'desde que empezaste',
  'home.heroCard.earningDaily': 'recibiendo diariamente',
  'home.heroCard.backedByMining': 'Respaldado por minería real',
  'home.heroCard.nextPayoutIn': '{{days}} días hasta el pago',
  'home.heroCard.daysToPayoutShort': 'hasta el pago',
  'home.heroCard.daysLabel': 'días',
  'home.heroCard.payoutDateHint': 'hasta el pago · {{date}}',
  'home.heroCard.totalAccruedTooltip': 'Suma de distribuciones del trimestre actual',

  'home.community.title': 'Resumen de la comunidad',
  'home.community.totalParticipants': 'Total de participantes',
  'home.community.activePositions': 'Posiciones activas',
  'home.community.miningPower': 'Poder de minería de la plataforma',
  'home.community.avgParticipation': 'Participación promedio',
  'home.community.months': 'meses',

  'home.chart.title': 'Total recibido en el tiempo',
  'home.chart.subtitle': 'Distribuciones acumuladas recibidas en USD',
  'home.chart.subtitlePeriodic': 'Distribuciones por período en USD',
  'home.chart.tooltipDaily': 'Diario',
  'home.chart.tooltipCumulative': 'Total',
  'home.chart.tooltipReceived': '{{date}}: {{amount}} recibido',
  'home.chart.cumulative': 'Acumulado',
  'home.chart.periodic': 'Por período',
  'home.chart.quarterlyPayout': 'Pago trimestral',
  'home.chart.kpiDate': 'Fecha',
  'home.chart.kpiReceived': 'Recibido',
  'home.chart.kpiTotal': 'Total del período: {{amount}}',
  'home.chart.7D': '7D',
  'home.chart.1M': '1M',
  'home.chart.3M': '3M',
  'home.chart.ALL': 'TODO',
  'home.chart.custom': 'Personalizado',
  'home.chart.dateFrom': 'Desde',
  'home.chart.dateTo': 'Hasta',
  'home.chart.periodSummary': 'Resumen del período',
  'home.chart.totalPaxg': 'Total PAXG',
  'home.chart.totalUsd': 'Total USD',
  'home.chart.avgDaily': 'Promedio diario',
  'home.chart.days': '{{count}} días',

  'home.dailyBreakdown.title': 'Registro de distribuciones',
  'home.dailyBreakdown.tooltip':
    'Desglose de tus distribuciones diarias de minería, costos y distribuciones netas.',
  'home.dailyBreakdown.infoAriaLabel': 'Información de distribuciones',
  'home.dailyBreakdown.showDetails': 'Mostrar detalles de minería',
  'home.dailyBreakdown.hideDetails': 'Ocultar detalles de minería',
  'home.dailyBreakdown.ayniBalance': 'Saldo AYNI',
  'home.dailyBreakdown.ayniPrice': 'Precio AYNI',
  'home.dailyBreakdown.goldRewards': 'Distribuciones en Oro',
  'home.dailyBreakdown.date': 'Fecha',
  'home.dailyBreakdown.earned': 'Recibido ($)',
  'home.dailyBreakdown.gold': 'Oro',
  'home.dailyBreakdown.costs': 'Costos',
  'home.dailyBreakdown.fee': 'Comisión',
  'home.dailyBreakdown.net': 'Neto',
  'home.dailyBreakdown.goldTooltip': 'Oro extraído por tu participación en este día',
  'home.dailyBreakdown.costsTooltip': 'Costos operacionales de extracción minera',
  'home.dailyBreakdown.feeTooltip': 'Comisión de servicio de la plataforma',
  'home.dailyBreakdown.netTooltip': 'Oro neto acreditado a tu cuenta',
  'home.dailyBreakdown.status': 'Estado',
  'home.dailyBreakdown.statusAccruing': 'Acumulando',
  'home.dailyBreakdown.statusAccruingTooltip':
    'Esta distribución se está acumulando y será incluida en tu próximo pago trimestral de PAXG.',
  'home.dailyBreakdown.statusPending': 'Pendiente',
  'home.dailyBreakdown.statusPendingTooltip':
    'Esta distribución se está procesando y será acreditada en breve.',
  'home.dailyBreakdown.statusPaid': 'Pagado',
  'home.dailyBreakdown.statusPaidTooltip':
    'Esta distribución ha sido pagada a tu saldo disponible.',

  'home.ctaBanner.title': 'Empieza a recibir distribuciones respaldadas por oro',
  'home.ctaBanner.titleHasBalance': 'Tienes {{amount}} disponible',
  'home.ctaBanner.titleNoBalance': 'Aumenta tu participación',
  'home.ctaBanner.titleUpgrade': 'Agrega {{amount}} para alcanzar {{level}}',
  'home.ctaBanner.subtitle': 'Empieza a recibir desde solo $100.',
  'home.ctaBanner.subtitleUpgrade': 'Desbloquea mayor producción diaria y nuevo equipo.',
  'home.ctaBanner.button': 'Comenzar',
  'home.ctaBanner.buttonOpenPosition': 'Abrir nueva posición',
  'home.ctaBanner.buttonAddFunds': 'Agregar fondos',
  'home.ctaBanner.buttonUpgrade': 'Aumentar participación',
  'home.ctaBanner.socialProof': '{{count}} participantes ya reciben distribuciones',

  // ── Social Proof ──
  'socialProof.participantsReceiving': '\u2714 {{count}} participantes ya reciben distribuciones',
  'socialProof.joinParticipants': 'Únete a {{count}} participantes',

  'home.chartJournal.tabChart': 'Gráfico',
  'home.chartJournal.tabJournal': 'Registro',

  'home.minePreview.title': 'Mi Concesión',
  'home.minePreview.level': 'Nivel',
  'home.minePreview.today': 'Hoy:',
  'home.minePreview.viewButton': 'Ver mina',

  'home.personalManager.managerName': 'Maria S.',
  'home.personalManager.subtitle': 'Tu asesor personal',
  'home.personalManager.chat': 'Chat',
  'home.personalManager.scheduleCall': 'Agendar llamada',
  'home.personalManager.advisorLabel': 'Tu asesor',
  'home.personalManager.call': 'Llamar',

  'home.dailyMineToast.title': '¡Tu mina produjo {{goldGrams}}g de oro hoy!',

  'home.statsSandwich.invested': 'Participación',
  'home.statsSandwich.investedTooltip': '{{totalAyni}} tokens AYNI a ${{ayniPrice}}/token',
  'home.statsSandwich.dailyEarnings': 'Distribución Diaria',
  'home.statsSandwich.nextPayout': 'Próximo Pago',
  'home.statsSandwich.thisQuarter': 'Este Trimestre',
  'home.statsSandwich.thisQuarterTooltip':
    'Distribuciones acumuladas diariamente. Estarán disponibles para retiro en tu próxima fecha de pago.',
  'home.statsSandwich.accruing': 'acumulando',
  'home.statsSandwich.moreInfo': 'Más información',
  'home.statsSandwich.inDays': 'en {{days}} días',

  'home.quickStats.invested': 'Participación',
  'home.quickStats.dailyEarnings': 'Distribución diaria',
  'home.quickStats.nextPayout': 'Próximo pago',

  'home.page.errorMessage': 'No se pudo cargar el panel. Intenta de nuevo.',
  'home.page.retryButton': 'Reintentar',

  // ── Earn ──
  'earn.calculator.title': 'Elige el monto de tu participación',
  'earn.calculator.ayniTooltip':
    'Los tokens AYNI representan tu participación en el pool de minería. El precio del token refleja el valor actual de los derechos de minería.',
  'earn.calculator.termLabel': '¿Por cuánto tiempo?',
  'earn.calculator.autoActivateLabel': 'La participación se activa inmediatamente',
  'earn.calculator.autoActivateDescription':
    'Las distribuciones se calculan en base a la producción minera real.',
  'earn.calculator.autoActivateTooltip':
    'Cuando está activado, tus tokens AYNI se activan inmediatamente para la minería y las distribuciones comienzan a acumularse. Cuando está desactivado, los tokens se agregan a tu saldo libre — puedes activarlos o retirarlos en cualquier momento.',
  'earn.calculator.ctaButton': 'Obtener {{ayni}} AYNI por {{amount}} →',
  'earn.calculator.ctaBenefit': 'Comienza a recibir oro por {{amount}} →',
  'earn.calculator.youEarnDaily': 'Ganas aproximadamente',
  'earn.calculator.estimatedApy': 'producción anual estimada',
  'earn.calculator.termsNote': 'Al participar, aceptas los términos de servicio',

  'earn.projection.monthly': 'Producción mensual',
  'earn.projection.daily': 'Producción diaria',
  'earn.projection.firstPayout': 'Primer pago',
  'earn.projection.firstPayoutTooltip':
    'Las distribuciones se acumulan diariamente desde el momento de la activación. Los pagos se realizan trimestralmente. Tu primer pago incluirá todas las distribuciones acumuladas desde la activación.',
  'earn.projection.paidIn': 'Pagado en',
  'earn.projection.paxgToken': 'PAXG (token respaldado por oro)',
  'earn.projection.willHold': 'Tendrás',
  'earn.projection.afterTermEnds': 'Al finalizar el plazo',
  'earn.projection.afterTermOptions': 'Retirar, extender o convertir',
  'earn.projection.afterUnlock': 'Después del desbloqueo',
  'earn.projection.unlockOptions': 'Vender, reinvertir o retirar',
  'earn.projection.header': 'Producción proyectada para {{termMonths}} meses',
  'earn.projection.goldOutputLabel': 'Producción de oro estimada',
  'earn.projection.goldOutputSuffix': 'de oro',
  'earn.projection.atCurrentGoldPrice': 'al precio actual del oro',
  'earn.projection.annualReturn': '',
  'earn.projection.payoutSchedule': 'Calendario de pagos',
  'earn.projection.quarterly': 'Trimestral',
  'earn.projection.quarterlyPayouts': 'Pagos trimestrales',
  'earn.projection.quarterlyTooltip':
    'Las distribuciones se calculan diariamente y se pagan trimestralmente a tu cuenta.',
  'earn.projection.payoutsPerYear': 'Distribuciones esperadas',
  'earn.projection.accrueFromDayOne':
    'Tus distribuciones se acumulan desde el primer día, pagadas trimestralmente',
  'earn.projection.disclaimer':
    'Las proyecciones se basan en la producción minera actual y los precios del oro. Las distribuciones son basadas en el protocolo y no están garantizadas. AYNI es un token de utilidad.',
  'earn.projection.rangeDisclaimer':
    'Los rangos se basan en la variabilidad de la producción minera y las fluctuaciones del precio del oro. Las distribuciones reales pueden diferir. AYNI es un token de utilidad.',
  'earn.projection.goldRangeNote': 'rango al precio actual del oro',

  'earn.paymentMethods.accepted': 'Aceptado',
  'earn.paymentMethods.visaMc': 'Visa / MC',
  'earn.paymentMethods.crypto': 'USDT / USDC',
  'earn.paymentMethods.wire': 'Transferencia',

  'earn.trust.peckshieldTooltip': 'Ver informe de auditoría PeckShield',
  'earn.trust.certikTooltip': 'Ver página de verificación Certik',
  'earn.trust.licensedMiningTooltip': 'Ver detalles de la licencia minera',
  'earn.trust.fundsProtectedTooltip':
    'Los fondos de los usuarios están protegidos por un fondo de estabilización que cubre riesgos operativos y asegura la continuidad de las distribuciones.',

  'earn.howItWorks.title': 'Cómo funciona',
  'earn.howItWorks.step1Title': 'Participa',
  'earn.howItWorks.step1Description': 'Elige tu monto desde $100',
  'earn.howItWorks.step2Title': 'Minamos',
  'earn.howItWorks.step2Description': 'Minería de oro sostenible',
  'earn.howItWorks.step3Title': 'Recibes',
  'earn.howItWorks.step3Description':
    'Las distribuciones se acumulan diariamente, pagadas trimestralmente',

  'earn.trust.peckshield': 'Auditado por PeckShield',
  'earn.trust.certik': 'Verificado por Certik',
  'earn.trust.licensedMining': 'Minería Licenciada',
  'earn.trust.fundsProtected': 'Fondos Protegidos',

  'earn.otc.backLink': 'Volver a calculadora',
  'earn.otc.successTitle': 'Cotización Solicitada',
  'earn.otc.successMessage':
    'Un asesor dedicado te contactará en 24 horas con términos personalizados para tu participación de {{amount}}.',
  'earn.otc.title': 'Participación OTC',
  'earn.otc.description':
    'Para participaciones desde $5,000, ofrecemos términos personalizados con soporte dedicado, procesamiento prioritario y períodos de bloqueo personalizados.',
  'earn.otc.amountLabel': 'Monto de participación',
  'earn.otc.messageLabel': 'Mensaje (opcional)',
  'earn.otc.messagePlaceholder': 'Método de contacto preferido, preferencias de plazo...',
  'earn.otc.ctaButton': 'Solicitar Cotización OTC',
  'earn.otc.trustNote': 'Un asesor dedicado te contactará en 24 horas',

  'earn.page.title': 'Empieza a Participar',
  'earn.page.subtitle':
    'Adquiere tokens AYNI y recibe distribuciones respaldadas por oro de minería real.',
  'earn.page.otcLink': '¿Participas con más de $5,000? Contacta a nuestro equipo →',

  'earn.disclaimer.footer':
    'AYNI TOKEN INC. no proporciona asesoramiento financiero, de inversión ni fiscal. Participar en la plataforma AYNI conlleva riesgos, incluyendo la posible pérdida del monto de participación. Consulte a un profesional calificado.',

  // ── Checkout ──
  'checkout.payButton': 'Pagar {{amount}}',
  'checkout.successTitle': '¡Orden confirmada!',
  'checkout.amountLabel': 'Monto',
  'checkout.tokensLabel': 'Tokens recibidos',
  'checkout.termLabel': 'Plazo',
  'checkout.estimatedDaily': 'Distribución diaria estimada',
  'checkout.estimatedEarnings': 'Distribuciones estimadas',
  'checkout.firstPayout': 'Primer pago',
  'checkout.viewPortfolio': 'Ver Posiciones',
  'checkout.investMore': 'Participar Más',

  'checkout.orderSummary.title': 'Resumen del pedido',
  'checkout.orderSummary.investmentAmount': 'Monto de participación',
  'checkout.orderSummary.youReceive': 'Recibes',
  'checkout.orderSummary.currentPrice': 'Precio actual de AYNI',
  'checkout.orderSummary.term': 'Plazo',
  'checkout.orderSummary.annualReturn': 'Tasa de distribución anual est.',
  'checkout.orderSummary.firstPayout': 'Primer pago',
  'checkout.orderSummary.processingFee': 'Comisión de procesamiento',
  'checkout.orderSummary.total': 'Total',

  'checkout.disclaimer.medium':
    'Estás adquiriendo tokens de utilidad AYNI. Las distribuciones se calculan a partir de datos de producción de oro reportados independientemente y no están garantizadas. Las distribuciones pasadas no son indicativas de resultados futuros.',

  // ── Portfolio ──
  'portfolio.overview.portfolioValue': 'Valor de Posiciones',
  'portfolio.overview.activePositions': '{{count}} posición{{s}} activa{{s}}',
  'portfolio.overview.allTimeEarned': 'Total recibido:',
  'portfolio.overview.allTimeEarnedTooltip':
    'Distribuciones esperadas durante todo el plazo de la posición (12 meses)',
  'portfolio.overview.available': 'Disponible',
  'portfolio.overview.invest': 'Participar',
  'portfolio.overview.goldRewards': 'Distribuciones en Oro',
  'portfolio.overview.withdraw': 'Retirar',
  'portfolio.overview.reinvest': 'Reinvertir',
  'portfolio.overview.reinvestTooltip': 'Convertir PAXG a AYNI. Comisión de conversión: 1.5%',
  'portfolio.overview.availableEmpty': 'No hay distribuciones disponibles aún',
  'portfolio.overview.accruingThisQuarter': 'Acumulando este trimestre',
  'portfolio.overview.availableAfter': 'Próximo pago trimestral: {{date}}',
  'portfolio.overview.noWithdrawTooltip':
    'No hay distribuciones disponibles para retiro. Tu próximo pago trimestral es el {{date}}.',
  'portfolio.overview.quarterlyPayoutInfo':
    'Pago trimestral. Próximo: {{date}} · ~{{amount}} estimado',
  'portfolio.overview.goldRewardsTooltip':
    'Las distribuciones de oro se acumulan diariamente pero se pagan trimestralmente a este saldo. En el día de pago, tu oro acumulado aparecerá aquí para retiro.',

  'portfolio.positionCard.positionTitle': 'Posición · {{date}}',
  'portfolio.positionCard.positionTitleFallback': 'Posición {{number}}',
  'portfolio.positionCard.termAndEnd': '{{termMonths}} meses · termina {{date}}',
  'portfolio.positionCard.invested': 'Participación',
  'portfolio.positionCard.holding': 'Bloqueado',
  'portfolio.positionCard.lockedTooltip':
    'Los tokens están bloqueados durante el periodo de participación.',
  'portfolio.positionCard.currentValue': 'Valor actual',
  'portfolio.positionCard.earned': 'Distribuido',
  'portfolio.positionCard.paidOut': 'Pagado',
  'portfolio.positionCard.thisQuarter': 'Este trimestre',
  'portfolio.positionCard.percentComplete': '{{percent}}% completado',
  'portfolio.positionCard.monthsRemaining': '{{months}} meses restantes',
  'portfolio.positionCard.nextPayout': 'Próximo pago: {{date}} · ~{{amount}} estimado',
  'portfolio.positionCard.wallet': 'Billetera:',
  'portfolio.positionCard.contract': 'Contrato:',
  'portfolio.positionCard.afterUnlock': 'Después del desbloqueo',
  'portfolio.positionCard.afterUnlockDescription':
    'Tus {{amount}} tokens AYNI estarán disponibles para vender, reinvertir o retirar.',
  'portfolio.positionCard.sellOnMarketplace': 'Vender en marketplace',
  'portfolio.positionCard.sellHint':
    'Vende en el marketplace a precio de mercado en vez de cancelar con una penalización del 5%.',
  'portfolio.positionCard.cancelPosition': 'Cancelar posición',
  'portfolio.positionCard.viewOnChain': 'Ver en cadena',
  'portfolio.positionCard.collapse': 'Colapsar',
  'portfolio.positionCard.expand': 'Expandir',
  'portfolio.positionCard.cancelModalTitle': 'Cancelar Posición',
  'portfolio.positionCard.cancelWarning':
    'La cancelación anticipada aplicará penalizaciones. Esta acción no se puede deshacer.',
  'portfolio.positionCard.cancelCurrentValue': 'Posición actual',
  'portfolio.positionCard.cancelPenaltyFee': 'Tarifa de penalización (5%)',
  'portfolio.positionCard.cancelYouReceive': 'Recibirás',
  'portfolio.positionCard.cancelLossDistributions':
    'Las distribuciones acumuladas pero no pagadas del trimestre actual serán confiscadas.',
  'portfolio.positionCard.keepPosition': 'Mantener posición',
  'portfolio.positionCard.confirmCancel': 'Confirmar cancelación',

  'portfolio.completedPosition.positionTitle': 'Posición {{number}}',
  'portfolio.completedPosition.invested': 'Participación',
  'portfolio.completedPosition.returned': 'Devuelto',
  'portfolio.completedPosition.earned': 'Distribuido',
  'portfolio.completedPosition.claimed': 'Reclamado',
  'portfolio.completedPosition.whatsNext': '¿Qué sigue?',
  'portfolio.completedPosition.restake': 'Reinvertir',
  'portfolio.completedPosition.sellAyni': 'Vender AYNI',
  'portfolio.completedPosition.withdraw': 'Retirar',
  'portfolio.completedPosition.wallet': 'Billetera:',
  'portfolio.completedPosition.contract': 'Contrato:',
  'portfolio.completedPosition.listOnMarketplace': 'Publicar en Marketplace',
  'portfolio.completedPosition.viewDetails': 'Ver detalles',

  'portfolio.reinvestModal.title': 'Reinvertir Distribuciones',
  'portfolio.reinvestModal.yourPaxgRewards': 'Tus distribuciones PAXG',
  'portfolio.reinvestModal.value': 'Valor',
  'portfolio.reinvestModal.conversionFee': 'Comisión de conversión (1.5%)',
  'portfolio.reinvestModal.youReceive': 'Recibes',
  'portfolio.reinvestModal.conversionInfo':
    'PAXG se convierte a AYNI dentro de la plataforma a tasas de mercado actuales. Se aplica una comisión de conversión del 1.5%.',
  'portfolio.reinvestModal.minimumWarning':
    'El monto mínimo de activación es $100 después de la comisión de conversión. Tu PAXG se convierte a ~{{amount}}. Necesitas ~{{needed}} más para reinvertir.',
  'portfolio.reinvestModal.stakingTerm': 'Plazo de bloqueo',
  'portfolio.reinvestModal.estimatedDaily': 'Distribución diaria estimada',
  'portfolio.reinvestModal.annualReturn': 'Tasa de distribución anual',
  'portfolio.reinvestModal.minimumRequired': 'Mínimo $100 requerido (~{{amount}} más necesario)',
  'portfolio.reinvestModal.reinvestButton': 'Reinvertir {{paxg}} PAXG → {{ayni}} AYNI',

  'portfolio.withdrawModal.title': 'Retirar a Billetera',
  'portfolio.withdrawModal.amountLabel': 'Monto ({{token}})',
  'portfolio.withdrawModal.exceedsBalance': 'Excede el saldo disponible',
  'portfolio.withdrawModal.ayniHelper': 'Disponible: {{amount}} AYNI (~{{usdValue}})',
  'portfolio.withdrawModal.paxgHelper': 'Disponible: {{amount}} PAXG (~{{usdValue}})',
  'portfolio.withdrawModal.youWithdraw': 'Retiras',
  'portfolio.withdrawModal.estimatedValue': 'Valor estimado',
  'portfolio.withdrawModal.walletInfo':
    'Los tokens serán enviados a tu billetera externa conectada. Asegúrate de que tu billetera soporte tokens ERC-20.',
  'portfolio.withdrawModal.noWalletWarning':
    'No hay billetera conectada. Por favor, agrega una dirección de billetera en Ajustes → Billeteras conectadas antes de retirar.',
  'portfolio.withdrawModal.withdrawButton': 'Retirar {{amount}} {{token}}',

  'portfolio.sellAyniModal.title': 'Vender Tokens AYNI',
  'portfolio.sellAyniModal.availableAyni': 'AYNI disponible',
  'portfolio.sellAyniModal.currentPrice': 'Precio actual',
  'portfolio.sellAyniModal.estimatedValue': 'Valor estimado',
  'portfolio.sellAyniModal.howToSell': 'Cómo vender',
  'portfolio.sellAyniModal.step1':
    'Conecta tu billetera a un exchange compatible (Uniswap, SushiSwap)',
  'portfolio.sellAyniModal.step2':
    'Selecciona el token AYNI e ingresa la cantidad que deseas vender',
  'portfolio.sellAyniModal.step3': 'Confirma la transacción en tu billetera y recibe USDT/USDC',
  'portfolio.sellAyniModal.priceWarning':
    'Los precios de los tokens pueden fluctuar. El valor estimado mostrado se basa en el precio actual y puede diferir al momento de la venta.',
  'portfolio.sellAyniModal.noBalance': 'No hay AYNI disponible para vender',
  'portfolio.sellAyniModal.goToExchange': 'Ir al exchange',

  'portfolio.freeBalance.title': 'Saldo Libre',
  'portfolio.freeBalance.activateButton': 'Participar',
  'portfolio.freeBalance.sellButton': 'Vender AYNI',
  'portfolio.freeBalance.withdrawButton': 'Retirar',
  'portfolio.freeBalance.topUpHint': 'Agrega {{amount}} más para alcanzar el mínimo',
  'portfolio.freeBalance.topUpLink': 'Recargar',
  'portfolio.freeBalance.readyToActivate': 'Listo para bloquear y recibir distribuciones',
  'portfolio.freeBalance.readyToActivateTooltip':
    'Tienes suficiente saldo para bloquear tokens AYNI y comenzar a recibir distribuciones diarias de minería.',
  'portfolio.freeBalance.sellButtonTooltip':
    'Intercambia tokens AYNI en exchanges descentralizados (Uniswap, SushiSwap)',

  'portfolio.activateModal.title': 'Activar Participación',
  'portfolio.activateModal.available': 'Saldo disponible',
  'portfolio.activateModal.ayniAmount': '{{amount}} AYNI',
  'portfolio.activateModal.amountLabel': 'Cantidad (AYNI)',
  'portfolio.activateModal.usdValue': 'Valor: ~{{amount}}',
  'portfolio.activateModal.minimumWarning':
    'La participación mínima es $100. Tu cantidad seleccionada es ~{{amount}}. Necesitas ~{{needed}} más.',
  'portfolio.activateModal.topUpButton': 'Recargar {{amount}}',
  'portfolio.activateModal.exceedsBalance': 'Excede el saldo disponible',
  'portfolio.activateModal.termLabel': 'Plazo de bloqueo',
  'portfolio.activateModal.termTooltip':
    'Los plazos de bloqueo más largos tienen comisiones de éxito más bajas, lo que resulta en distribuciones netas más altas. Elige un plazo que se ajuste a tu horizonte temporal.',
  'portfolio.activateModal.estimatedDaily': 'Distribución diaria estimada',
  'portfolio.activateModal.annualReturn': 'Tasa de distribución anual',
  'portfolio.activateModal.activateButton': 'Activar {{amount}} AYNI',

  'checkout.successFreeBalance':
    'Tu AYNI ha sido añadido a tu saldo libre. Puedes activar o retirar en cualquier momento.',
  'checkout.viewBalance': 'Ver Saldo',

  'portfolio.positionTabs.active': 'Activas',
  'portfolio.positionTabs.completed': 'Completadas',

  'portfolio.advancedToggle.label': 'Mostrar detalles avanzados',
  'portfolio.advancedToggle.ariaLabel': 'Alternar detalles avanzados de posición',

  'portfolio.page.title': 'Tus Posiciones',
  'portfolio.page.emptyTitle': 'Sin posiciones aún',
  'portfolio.page.emptyDescription':
    'Empieza a participar para recibir distribuciones respaldadas por oro.',
  'portfolio.page.emptyCta': 'Empezar a participar',
  'portfolio.page.hint': 'Rastrea todas tus posiciones activas y distribuciones acumuladas aquí.',

  // ── Activity ──
  'activity.dateGroup.today': 'Hoy',
  'activity.dateGroup.yesterday': 'Ayer',
  'activity.dateGroup.thisWeek': 'Esta semana',
  'activity.dateGroup.lastWeek': 'Semana pasada',
  'activity.loadMore': 'Cargar más',

  'activity.filter.all': 'Todo',
  'activity.filter.distributions': 'Distribuciones',
  'activity.filter.payments': 'Pagos',
  'activity.filter.payouts': 'Desembolsos',
  'activity.filter.system': 'Sistema',

  'activity.page.title': 'Actividad',
  'activity.page.errorMessage': 'No se pudo cargar la actividad. Intenta de nuevo.',
  'activity.page.hint':
    'Mira tu historial de transacciones — depósitos, retiros y pagos de distribuciones.',
  'activity.page.export': 'Exportar',
  'activity.page.downloadCsv': 'Descargar CSV',
  'activity.page.emptyTitle': 'Sin actividad aún',
  'activity.page.emptyDescription':
    'Todas tus transacciones y distribuciones aparecerán en este feed.',

  // ── Learn ──
  'learn.page.title': 'Aprender',
  'learn.page.subtitle': 'Todo lo que necesitas saber sobre recibir distribuciones con AYNI',
  'learn.gettingStarted': 'Primeros pasos',

  'learn.search.placeholder': 'Buscar artículos y guías...',
  'learn.search.noResults': 'No se encontraron artículos que coincidan con tu búsqueda.',

  'learn.tutorial.howItWorks': 'Cómo funciona',
  'learn.tutorial.howItWorksDesc': 'Cómo AYNI se conecta con la minería real de oro',
  'learn.tutorial.howItWorksDuration': '2 min',
  'learn.tutorial.firstInvestment': 'Tu primera participación',
  'learn.tutorial.firstInvestmentDesc':
    'Guía paso a paso desde el registro hasta las distribuciones',
  'learn.tutorial.firstInvestmentDuration': '3 min',
  'learn.tutorial.understandingEarnings': 'Entendiendo tus distribuciones',
  'learn.tutorial.understandingEarningsDesc': 'Cómo se calculan y pagan las distribuciones',
  'learn.tutorial.understandingEarningsDuration': '1 min',
  'learn.tutorial.typeVideo': 'Video',
  'learn.tutorial.typeArticle': 'Artículo',

  'learn.faq.title': 'Preguntas frecuentes',
  'learn.faq.q1.title': '¿Qué es AYNI y cómo funciona?',
  'learn.faq.q1.content':
    'AYNI es una plataforma respaldada por oro que te conecta con operaciones reales de minería de oro. Tu participación financia actividades mineras, y recibes distribuciones basadas en la extracción real de oro, pagadas en PAXG (oro tokenizado).',
  'learn.faq.q2.title': '¿Cómo se calculan mis distribuciones?',
  'learn.faq.q2.content':
    'Las distribuciones se calculan según tu participación en el pool de minería y la cantidad de oro extraído durante cada ciclo. Tus distribuciones son proporcionales a tu monto de participación en relación al tamaño total del pool.',
  'learn.faq.q3.title': '¿Cuándo recibo mis pagos?',
  'learn.faq.q3.content':
    'Los pagos se distribuyen al final de cada ciclo de minería, normalmente de forma mensual. Puedes rastrear tus pagos pendientes en la sección de Posiciones y retirarlos a tu billetera en cualquier momento.',
  'learn.faq.q4.title': '¿Es segura mi participación?',
  'learn.faq.q4.content':
    'Tu participación está respaldada por activos reales de oro. Empleamos medidas de seguridad estándar de la industria, incluyendo billeteras multi-firma, auditorías regulares y reportes transparentes de las operaciones mineras.',
  'learn.faq.q5.title': '¿Cómo retiro mis distribuciones?',
  'learn.faq.q5.content':
    'Navega a tus Posiciones, selecciona la posición de la que deseas retirar y toca "Retirar". Las distribuciones se envían como PAXG a tu billetera conectada, normalmente dentro de 24 horas.',
  'learn.faq.q6.title': '¿Qué es PAXG?',
  'learn.faq.q6.content':
    'PAXG (Pax Gold) es un token digital donde cada token está respaldado por una onza troy de oro fino almacenado en bóvedas de Londres. Te permite poseer y comerciar oro real en la blockchain.',
  'learn.faq.q7.title': 'Cómo vender tus tokens AYNI',
  'learn.faq.q7.content':
    'Después de que termine tu plazo de bloqueo, tus tokens AYNI se desbloquean y están disponibles para vender. Conecta tu billetera a un exchange compatible (como Uniswap o SushiSwap), selecciona AYNI, ingresa la cantidad que deseas vender y confirma la transacción. Recibirás USDT o USDC a cambio. También puedes vender directamente desde la página de Posiciones usando el botón "Vender AYNI" en cualquier posición completada.',
  'learn.faq.q8.title': 'Entendiendo el precio del token AYNI',
  'learn.faq.q8.content':
    'El precio del token AYNI refleja el valor actual de los derechos de minería en el pool de minería de oro. Se determina por la oferta y demanda del mercado en exchanges descentralizados. Cuando participas, tus dólares se convierten a AYNI al precio actual. El precio puede fluctuar con el tiempo, pero tus distribuciones de minería (pagadas en PAXG) se basan en la extracción real de oro, no en el precio del token. Esto significa que tus distribuciones están vinculadas a la producción de oro, independientemente de los movimientos de precio de AYNI.',
  'learn.faq.q9.title': '¿Dónde puedo verificar en la cadena?',
  'learn.faq.q9.content':
    'Todas las transacciones de AYNI y PAXG se registran en la blockchain de Ethereum. Puedes verificar cualquier transacción usando la dirección de tu billetera en Etherscan (etherscan.io). Cada distribución de PAXG es rastreable desde el contrato del pool de minería hasta tu billetera.',
  'learn.faq.q10.title': '¿En qué blockchain está AYNI?',
  'learn.faq.q10.content':
    'AYNI es un token ERC-20 en la red principal de Ethereum. Todos los tokens — AYNI y distribuciones PAXG — siguen el estándar ERC-20, haciéndolos compatibles con cualquier billetera Ethereum como MetaMask, Trust Wallet o Ledger.',
  'learn.faq.q11.title': '¿Dónde están los informes de auditoría?',
  'learn.faq.q11.content':
    'Nuestros contratos inteligentes han sido auditados por PeckShield y verificados por CertiK. Puedes acceder a los informes completos en la sección de Confianza arriba.',
  'learn.faq.q12.title': '¿Cuál es la dirección del contrato del token?',
  'learn.faq.q12.content': 'La dirección del contrato del token AYNI es:',
  'learn.faq.q12.copied': '¡Copiado!',

  'learn.howItWorks.title': 'Cómo funciona tu participación',
  'learn.howItWorks.invest': 'Participar',
  'learn.howItWorks.investTooltip': 'Participas adquiriendo una porción del pool de minería.',
  'learn.howItWorks.mining': 'Minería',
  'learn.howItWorks.miningTooltip':
    'Tus fondos apoyan operaciones reales de minería de oro en instalaciones certificadas.',
  'learn.howItWorks.goldExtracted': 'Oro Extraído',
  'learn.howItWorks.goldExtractedTooltip':
    'El oro físico es extraído y refinado de la operación minera.',
  'learn.howItWorks.paxg': 'PAXG',
  'learn.howItWorks.paxgTooltip':
    'El oro extraído se tokeniza en PAXG, un activo digital regulado respaldado por oro.',
  'learn.howItWorks.wallet': 'Tu Billetera',
  'learn.howItWorks.walletTooltip':
    'Las distribuciones en PAXG se depositan directamente en tu billetera conectada.',

  'learn.contact.title': '¿Necesitas ayuda?',
  'learn.contact.emailSupport': 'Soporte por email',
  'learn.contact.liveChat': 'Chat en vivo',
  'learn.contact.fullDocumentation': 'Documentación completa',

  // ── Learn: Trust Section ──
  'learn.trust.sectionTitle': 'Por qué puedes confiar en AYNI',
  'learn.trust.miningPartner.title': 'Minerales San Hilario S.C.R.L.',
  'learn.trust.miningPartner.text':
    'Empresa minera de oro licenciada en Perú. Concesión #070011405 registrada en INGEMMET. 8 km² de concesión aluvial en Madre de Dios.',
  'learn.trust.miningPartner.cta': 'Ver Scoping Study',
  'learn.trust.audits.title': 'Auditoría independiente',
  'learn.trust.audits.text':
    'Contratos inteligentes auditados por PeckShield y CertiK. Estándar de token ERC-20.',
  'learn.trust.audits.ctaPeckshield': 'Informe PeckShield',
  'learn.trust.audits.ctaCertik': 'Auditoría CertiK',
  'learn.trust.legal.title': 'AYNI TOKEN INC.',
  'learn.trust.legal.text':
    'International Business Company constituida en las Islas Vírgenes Británicas. Empresa #2174797.',
  'learn.trust.legal.cta': 'Ver términos',
  'learn.trust.equipment.title': 'Operaciones reales',
  'learn.trust.equipment.text':
    '6 excavadoras, 3 cargadores, 3 camiones volquete, 4 unidades scrubber-trommel. Separación de oro por gravedad completa.',
  'learn.trust.equipment.cta': 'Ver fotos',

  // ── Learn: Proof of Mining ──
  'learn.proofOfMining.sectionTitle': 'Transparencia minera',
  'learn.proofOfMining.statusActive': 'Minería activa',
  'learn.proofOfMining.location': 'San Hilario, Madre de Dios, Perú',
  'learn.proofOfMining.latestReport': 'Último informe',
  'learn.proofOfMining.weekOf': 'Semana del {{date}}',
  'learn.proofOfMining.goldExtracted': 'Oro extraído',
  'learn.proofOfMining.operationalHours': 'Horas operativas',
  'learn.proofOfMining.equipmentUtilization': 'Utilización de equipos',
  'learn.proofOfMining.viewFullReport': 'Ver informe completo',
  'learn.proofOfMining.photosTitle': 'Fotos del sitio',
  'learn.proofOfMining.photosPlaceholder': 'Las fotos de nuestra operación minera aparecerán aquí',

  // ── Mine ──
  'mine.header.title': 'Mi Concesión',
  'mine.header.levelDisplay': 'Nivel {{level}}: {{name}}',
  'mine.header.levelBadge': 'Nvl {{level}}',
  'mine.header.premiumBadge': 'Premium',

  'mine.progress.maxLevel': '¡Has alcanzado el nivel más alto!',
  'mine.progress.maxLevelLabel': 'Nivel máximo',
  'mine.progress.ariaLabel': 'Progreso de nivel: {{percent}}% hacia {{name}}',
  'mine.progress.investPrompt': 'Agrega {{amount}} más para alcanzar {{name}}',

  'mine.production.title': 'Producción de hoy',
  'mine.production.goldLabel': '{{grams}}g de oro',
  'mine.production.streakLabel': 'Racha de {{days}} días',
  'mine.production.activeDaysLabel': 'Día {{days}} desde el inicio',
  'mine.production.weeklyLabel': 'Esta semana: {{grams}}g · {{usd}}',

  'mine.stats.workers': 'Trabajadores',
  'mine.stats.workersSolo': 'minero solo',
  'mine.stats.workersCrew': '{{count}} equipo',
  'mine.stats.equipment': 'Equipo',
  'mine.stats.output': 'Producción',
  'mine.stats.outputDaily': 'diario',
  'mine.stats.efficiency': 'Eficiencia',

  'mine.upgrade.title': 'Mejora tu mina',
  'mine.upgrade.description': 'Agrega {{amount}} más para alcanzar nivel {{name}}',
  'mine.upgrade.unlockHint': 'Desbloquear: {{workers}} trabajadores, {{equipment}}',
  'mine.upgrade.button': 'Participar y mejorar',

  'mine.achievements.title': 'Logros',
  'mine.achievements.unlocked': '{{title}} — desbloqueado',
  'mine.achievements.locked': '{{title}} — bloqueado',
  'mine.achievements.lockedTooltip': '¡Sigue adelante!',
  'mine.achievements.toastTitle': '¡Logro desbloqueado!',

  'mine.timeline.title': 'Historial de mina',
  'mine.timeline.started': 'Empezaste a minar',
  'mine.timeline.firstGold': 'Primer oro recibido',
  'mine.timeline.streak7': '¡Racha de 7 días!',
  'mine.timeline.streak14': '¡Racha de 14 días!',
  'mine.timeline.levelUp': 'Subida de nivel',
  'mine.timeline.nextLevel': 'Siguiente: Alcanzar nivel {{name}}',
  'mine.timeline.goal': 'Meta',

  'mine.streak.badge': 'días de racha',
  'mine.streak.ariaLabel': 'Racha de inicio de sesión actual: {{days}} días',

  'mine.viewToggle.visual': 'Visual',
  'mine.viewToggle.data': 'Datos',
  'mine.dataView.title': 'Datos de producción',
  'mine.dataView.todayProduction': 'Producción de hoy',
  'mine.dataView.dailyOutput': 'Producción diaria',
  'mine.dataView.weeklyOutput': 'Semanal',
  'mine.dataView.monthlyOutput': 'Mensual',
  'mine.dataView.totalOutput': 'Desde el inicio',
  'mine.dataView.totalOutputTooltip': 'Valor total del oro extraído en tu mina',
  'mine.dataView.level': 'Nivel',
  'mine.dataView.totalParticipation': 'Participación total',
  'mine.dataView.power': 'Potencia',
  'mine.dataView.extractionRate': 'Tasa de extracción',
  'mine.dataView.progress': 'Aumente su participación en {{amount}} para nivel {{name}}',

  'mine.illustration.ariaLabel': 'Ilustración de tu concesión minera Nivel {{level}} {{name}}',

  'mine.levels.1': 'Explorador',
  'mine.levels.2': 'Prospector',
  'mine.levels.3': 'Operación',
  'mine.levels.4': 'Campamento Minero',
  'mine.levels.5': 'Imperio Dorado',

  // ── Settings ──
  'settings.page.title': 'Configuración',

  'settings.theme.light': 'Claro',
  'settings.theme.dark': 'Oscuro',
  'settings.theme.system': 'Sistema',

  'settings.language.en': 'English',
  'settings.language.es': 'Español',
  'settings.language.ru': 'Русский',

  'settings.display.usd': 'USD',
  'settings.display.ayniPaxg': 'AYNI+PAXG',
  'settings.display.both': 'Ambos',

  'settings.group.account': 'Cuenta',
  'settings.group.app': 'Aplicación',
  'settings.group.display': 'Visualización',

  'settings.section.security': 'Seguridad',
  'settings.section.paymentMethods': 'Métodos de pago',
  'settings.section.appearance': 'Apariencia',
  'settings.section.notifications': 'Notificaciones',
  'settings.section.language': 'Idioma',
  'settings.section.advancedView': 'Vista avanzada',
  'settings.section.display': 'Visualización',
  'settings.section.connectedWallets': 'Billeteras conectadas',
  'settings.section.paymentCards': 'Tarjetas de pago',
  'settings.section.referral': 'Referidos',

  'settings.advancedView.helper': 'Mostrar hashes, direcciones y datos técnicos de tokens',
  'settings.notifications.enable': 'Notificaciones del navegador',
  'settings.notifications.enableHelper':
    'Mostrar alertas al recibir recompensas, ofertas o actualizaciones',
  'settings.notifications.notSupported': 'Tu navegador no admite notificaciones',
  'settings.notifications.blocked':
    'Las notificaciones están bloqueadas en la configuración del navegador',
  'settings.notifications.permissionStatus': 'Estado del permiso',
  'settings.notifications.status.granted': 'Permitido',
  'settings.notifications.status.denied': 'Bloqueado',
  'settings.notifications.status.default': 'No solicitado',
  'settings.notifications.statusNotSupported': 'No compatible',
  'settings.display.units': 'Unidades',
  'settings.display.unitsHelper': 'Cómo se muestran los montos',

  'settings.notifyMe': 'Notificarme',
  'settings.notifyMeToast': 'Te notificaremos cuando esta función esté disponible',

  'settings.profile.defaultName': 'Usuario',
  'settings.profile.editButton': 'Editar perfil',

  'settings.dangerZone.signOut': 'Cerrar sesión',
  'settings.dangerZone.deleteAccount': 'Eliminar cuenta',
  'settings.dangerZone.deleteModalTitle': '¿Eliminar cuenta?',
  'settings.dangerZone.deleteModalMessage':
    'Esta acción es permanente y no se puede deshacer. Todos tus datos, posiciones e historial serán eliminados.',

  // ── Onboarding ──
  'onboarding.slide1.title': 'Tú participas',
  'onboarding.slide1.description': 'Adquiere tokens AYNI desde $100. Paga con tarjeta o crypto.',
  'onboarding.slide2.title': 'Obtén tokens AYNI',
  'onboarding.slide2.description':
    'Los tokens AYNI representan tu participación en el pool de minería de oro. Cuanto más participas, más tokens posees.',
  'onboarding.slide3.title': 'AYNI mina oro',
  'onboarding.slide3.description':
    'Tus tokens se ponen a trabajar en operaciones reales de minería en Sudamérica, extrayendo oro cada día.',
  'onboarding.slide4.title': 'Recibes PAXG',
  'onboarding.slide4.description':
    'Distribuciones diarias, pagadas trimestralmente. Retira después de tu plazo.',
  'onboarding.skip': 'Saltar',
  'onboarding.next': 'Siguiente',
  'onboarding.letsStart': 'Empecemos',
  'onboarding.whatIsAyni': '¿Qué es AYNI?',
  'onboarding.whatIsAyniContent':
    'AYNI es un token de utilidad que representa tu participación en el pool de minería de oro. Cuando participas con dólares, se convierten en tokens AYNI al precio actual del mercado. Tus tokens AYNI están bloqueados durante la duración de tu plazo elegido, durante el cual generan distribuciones diarias de minería de oro pagadas en PAXG. Después de que termine tu plazo, puedes vender tus tokens AYNI, reinvertirlos o retirarlos.',
  'onboarding.hint.dismiss': 'Descartar sugerencia',

  'onboarding.carousel.slide1.title': 'Elige tu monto',
  'onboarding.carousel.slide1.description':
    'Desde $100. Tus tokens están respaldados por minería de oro real.',
  'onboarding.carousel.slide2.title': 'Minamos oro',
  'onboarding.carousel.slide2.description':
    'Minería licenciada en Perú. Distribuciones acumuladas cada día.',
  'onboarding.carousel.slide3.title': 'Recibes oro',
  'onboarding.carousel.slide3.description':
    'Pagos trimestrales en PAXG — un token respaldado por oro físico.',
  'onboarding.carousel.cta': 'Comenzar a participar',

  // ── UI Kit ──
  'ui.amountInput.ariaLabel': 'Monto de participación',
  'ui.amountInput.custom': 'Personalizado',
  'ui.amountInput.minimum': 'Monto mínimo: ${{amount}}',
  'ui.amountInput.minimumError': 'El mínimo es ${{amount}}',

  'ui.slider.6mo': '6m',
  'ui.slider.12mo': '12m',
  'ui.slider.24mo': '24m',
  'ui.slider.36mo': '36m',
  'ui.slider.48mo': '48m',

  // ── Value Flow ──
  'valueFlow.ariaLabel': 'Información de la cadena de valor',
  'valueFlow.learnMore': 'Más información',
  'valueFlow.step1Label': 'USD',
  'valueFlow.step2Label': 'AYNI',
  'valueFlow.step3Label': 'Minería',
  'valueFlow.step4Label': 'Oro',
  'valueFlow.step5Label': 'PAXG',
  'valueFlow.section.title': 'Cómo funciona la cadena de valor',
  'valueFlow.section.step1Title': 'Pagas en USD',
  'valueFlow.section.step1Desc':
    'Elige tu monto de participación desde $100. Tus dólares se convierten en tokens AYNI al precio actual del mercado.',
  'valueFlow.section.step2Title': 'Recibes tokens AYNI',
  'valueFlow.section.step2Desc':
    'Los tokens AYNI representan tu participación en la capacidad de minería de la concesión. Más tokens, mayor tu participación.',
  'valueFlow.section.step3Title': 'La concesión mina oro',
  'valueFlow.section.step3Desc':
    'Oro real se extrae diariamente en operaciones mineras licenciadas en Sudamérica. La producción se mide en gramos.',
  'valueFlow.section.step4Title': 'El oro se convierte en PAXG',
  'valueFlow.section.step4Desc':
    'El oro extraído se tokeniza en PAXG — un activo digital regulado donde 1 PAXG = 1 onza troy de oro.',
  'valueFlow.section.step5Title': 'PAXG va a tu billetera',
  'valueFlow.section.step5Desc':
    'PAXG se acumula en tu billetera virtual. Puedes retirarlo como USD o PAXG después de tu fecha de pago.',
  'valueFlow.section.exampleTitle': 'Ejemplo',
  'valueFlow.section.exampleText':
    '$500 → 1,702 AYNI → minería ~0.013g/día → ~$190 en PAXG en 12 meses',
  'valueFlow.section.disclaimer':
    'Estimación basada en la producción minera actual. No garantizado.',

  // ── Trust Page ──
  'trust.page.title': 'Confianza y Transparencia',
  'trust.page.subtitle':
    'Mira exactamente cómo funciona tu participación — de la mina a tu billetera',

  // Trust: Tabs
  'trust.tab.operations': 'Operaciones',
  'trust.tab.documents': 'Documentos',
  'trust.tab.legal': 'Legal',
  'trust.tab.risks': 'Riesgos',
  'trust.tab.reserves': 'Reservas',

  // Trust: Hero stats
  'trust.hero.extracted': 'extraído',
  'trust.hero.concessions': 'concesiones',
  'trust.hero.participants': 'participantes',

  // Trust: Executive Summary
  'trust.summary.license': 'Licencia INGEMMET #070011405',
  'trust.summary.audits': 'Auditoría PeckShield + CertiK (aprobada)',
  'trust.summary.stats': "{{count}} participantes · {{gold}} extraído (jul–dic '25)",

  // Trust: Team
  'trust.team.title': 'Sobre el Equipo',
  'trust.team.comingSoon': 'Perfiles del equipo y liderazgo próximamente',

  'trust.status.miningActive': 'Minería Activa',
  'trust.status.maintenance': 'Mantenimiento',
  'trust.status.paused': 'Pausado',
  'trust.status.participants': 'Total Participantes',
  'trust.status.concession': 'Concesión',
  'trust.status.operatingSince': 'Operando Desde',
  'trust.status.equipment': 'Equipamiento',
  'trust.status.equipmentUnits': '{{count}} unidades',
  'trust.status.licensed': 'Licenciado',
  'trust.status.acquired': 'Adquirida',
  'trust.status.acquiredDate': 'Adquirida',
  'trust.status.phase': 'Fase',

  'trust.miningPartner.title': 'Socio Minero',
  'trust.miningPartner.companyName': 'Minerales San Hilario S.C.R.L.',
  'trust.miningPartner.description':
    'Empresa minera de oro licenciada en Perú. Establecida en 2023. Opera bajo licencia de concesión oficial #070011405 emitida por INGEMMET.',
  'trust.miningPartner.location': 'Ubicación',
  'trust.miningPartner.area': 'Área',
  'trust.miningPartner.areaValue': '8 km\u00B2 concesión aluvial',
  'trust.miningPartner.coordinates': 'Coordenadas',
  'trust.miningPartner.seeRegistration': 'Ver Registro',
  'trust.concession.active': 'Activa',
  'trust.concession.acquired': 'Adquirida',
  'trust.rosemaryUno.description':
    'Nueva concesión adquirida en Q4 2025 en la región de Madre de Dios. Actualmente en fase de pre-desarrollo con ingeniería y adquisición de equipos planificados para Q4 2026.',
  'trust.rosemaryUno.phase': 'Fase',
  'trust.rosemaryUno.phaseValue': 'Pre-desarrollo',
  'trust.rosemaryUno.authority': 'Autoridad',
  'trust.rosemaryUno.roadmap': 'Hoja de Ruta',

  'trust.equipment.excavators': 'Excavadoras',
  'trust.equipment.loaders': 'Cargadores',
  'trust.equipment.dumpTrucks': 'Camiones volquete',
  'trust.equipment.trommels': 'Unidades scrubber-trommel',
  'trust.equipment.goldSeparation': 'Separación de oro',
  'trust.equipment.goldSeparationDesc': 'Gravimétrica, equipo completo',
  'trust.equipment.facilities': 'Instalaciones',
  'trust.equipment.facilitiesDesc': 'Residencial en sitio',

  'trust.scopingStudy.title': 'Fundamento Técnico',
  'trust.scopingStudy.phase1': 'Scoping Study Fase 1',
  'trust.scopingStudy.author': 'Minerales San Hilario SRL',
  'trust.scopingStudy.date': 'Mayo 2025',
  'trust.scopingStudy.area': 'Área',
  'trust.scopingStudy.depth': 'Profundidad evaluada',
  'trust.scopingStudy.grade': 'Ley promedio',
  'trust.scopingStudy.potential': 'Potencial',
  'trust.scopingStudy.recovery': 'Tasa de recuperación',
  'trust.scopingStudy.verifiedBy': 'Verificado por',
  'trust.scopingStudy.readReport': 'Leer Informe Completo',
  'trust.scopingStudy.disclaimer':
    'Este es un objetivo de exploración conceptual, no una estimación de recursos minerales conforme. Sirve como referencia de planificación para futuros sondeos y evaluaciones.',

  'trust.proofOfMining.title': 'Operaciones Mineras',
  'trust.proofOfMining.productionReport': 'Informe de extracción y ventas',
  'trust.proofOfMining.period': '{{period}}',
  'trust.proofOfMining.viewFull': 'Ver completo',
  'trust.proofOfMining.totalExtracted': 'Total extraído',
  'trust.proofOfMining.totalSold': 'Total vendido',
  'trust.proofOfMining.monthlyBreakdown': 'Desglose mensual',
  'trust.proofOfMining.colMonth': 'Mes',
  'trust.proofOfMining.colExtracted': 'Extraído',
  'trust.proofOfMining.colSold': 'Vendido',
  'trust.proofOfMining.sitePhotos': 'Fotos del sitio',
  'trust.proofOfMining.photosPlaceholder': 'Fotos del sitio próximamente',
  'trust.proofOfMining.videoUpdate': 'Última actualización en video',
  'trust.proofOfMining.videoPlaceholder': 'Actualización en video próximamente',

  // ── Trust: Reserves Dashboard ──
  'trust.reserves.totalMined': 'Total extraído',
  'trust.reserves.coverageRatio': 'Ratio de cobertura',
  'trust.reserves.tokenBacking': 'Respaldo del token',
  'trust.reserves.onChainHolders': 'Titulares on-chain',
  'trust.reserves.onChainData': 'Datos on-chain',
  'trust.reserves.token': 'Token',
  'trust.reserves.standard': 'Estándar',
  'trust.reserves.totalSupply': 'Oferta total',
  'trust.reserves.contract': 'Contrato',
  'trust.reserves.reserveWallet': 'Billetera de reserva',
  'trust.reserves.copied': 'Copiado',
  'trust.reserves.copyAddress': 'Copiar dirección',
  'trust.reserves.copyWallet': 'Copiar billetera',
  'trust.reserves.lastUpdated': 'Última actualización: {{date}}',
  'trust.reserves.monthlyProduction': 'Producción mensual',
  'trust.reserves.extracted': 'Extraído',
  'trust.reserves.sold': 'Vendido',
  'trust.reserves.gExtracted': '{{amount}}g extraído',
  'trust.reserves.auditTimeline': 'Línea de auditorías',
  'trust.reserves.smartContractAudit': 'Auditoría de seguridad de contrato inteligente',
  'trust.reserves.nextReserveAudit': 'Próxima auditoría de reservas',
  'trust.reserves.scheduled': 'Programado',
  'trust.reserves.passed': 'Aprobado',
  'trust.reserves.scheduledDate': 'Programado: {{date}}',

  'trust.audits.title': 'Infraestructura Web3 Auditada',
  'trust.audits.peckshield': 'Auditoría de Seguridad PeckShield',
  'trust.audits.certik': 'Auditoría de Contratos CertiK',
  'trust.audits.passed': 'Aprobado',
  'trust.audits.viewReport': 'Ver Informe',
  'trust.audits.viewAudit': 'Ver Auditoría',
  'trust.audits.certikPage': 'Página CertiK',
  'trust.audits.tokenName': 'Nombre del token',
  'trust.audits.symbol': 'Símbolo',
  'trust.audits.standard': 'Estándar',
  'trust.audits.totalSupply': 'Suministro total',
  'trust.audits.contract': 'Contrato',
  'trust.audits.copyAddress': 'Copiar dirección',
  'trust.audits.copied': '¡Copiado!',
  'trust.audits.viewOnEtherscan': 'Ver en Etherscan',

  'trust.legal.title': 'Estructura Legal',
  'trust.legal.ayniType': 'International Business Company (IBC)',
  'trust.legal.ayniJurisdiction': 'Jurisdicción',
  'trust.legal.ayniCompanyNumber': 'Empresa #',
  'trust.legal.ayniAddress': 'Dirección',
  'trust.legal.viewTerms': 'Ver Términos',
  'trust.legal.mineralesType': 'Empresa minera registrada bajo ley peruana',
  'trust.legal.ruc': 'RUC',
  'trust.legal.registered': 'Registrada',
  'trust.legal.concession': 'Concesión',
  'trust.legal.authority': 'Autoridad',
  'trust.legal.seeRegistration': 'Ver Registro',

  'trust.valueFlow.title': 'Cómo Funciona Tu Participación',
  'trust.valueFlow.step1Title': 'Participa',
  'trust.valueFlow.step1Desc': 'Eliges un monto desde $100',
  'trust.valueFlow.step2Title': 'Adquiere AYNI',
  'trust.valueFlow.step2Desc':
    'Los tokens representan tu participación en capacidad minera (1 AYNI = 4 cm\u00B3/hora)',
  'trust.valueFlow.step3Title': 'Minería',
  'trust.valueFlow.step3Desc':
    'Minerales SH opera 16h/día con equipo industrial en Madre de Dios, Perú',
  'trust.valueFlow.step4Title': 'Oro Extraído',
  'trust.valueFlow.step4Desc': 'Oro real extraído de sedimentos aluviales, medido en gramos',
  'trust.valueFlow.step5Title': 'Convertir a PAXG',
  'trust.valueFlow.step5Desc':
    'La producción de oro se convierte en PAXG — token respaldado 1:1 por oro físico (Paxos)',
  'trust.valueFlow.step6Title': 'Tus Distribuciones',
  'trust.valueFlow.step6Desc':
    'PAXG se acumula diariamente, pagado trimestralmente. Retira en PAXG o USD.',

  'trust.stabilityFund.title': 'Fondo de Estabilidad',
  'trust.stabilityFund.description':
    'Mantenemos un fondo de reserva para asegurar distribuciones consistentes',
  'trust.stabilityFund.fundSize': 'Tamaño del fondo',
  'trust.stabilityFund.source': 'Fuente',
  'trust.stabilityFund.sourceValue': '20\u201330% de ventas de tokens',
  'trust.stabilityFund.purpose': 'Propósito',
  'trust.stabilityFund.purposeValue':
    'Suavizar distribuciones durante pausas operativas o periodos de mantenimiento',
  'trust.stabilityFund.viewOnChain': 'Ver en cadena',
  'trust.stabilityFund.placeholder':
    'El fondo de estabilidad está siendo establecido. Los detalles aparecerán aquí.',

  'trust.risks.title': 'Divulgaciones Importantes',
  'trust.risks.riskColumn': 'Riesgo',
  'trust.risks.descriptionColumn': 'Descripción',
  'trust.risks.mitigationColumn': 'Mitigación',
  'trust.risks.disclaimer':
    'AYNI TOKEN INC. no proporciona asesoramiento financiero, de inversión ni fiscal. Participar en la plataforma AYNI conlleva riesgos, incluyendo la posible pérdida del monto de participación. Las distribuciones pasadas no son indicativas de resultados futuros. Consulte a un profesional calificado.',

  'trust.faq.title': 'Preguntas Sobre Confianza y Seguridad',
  'trust.faq.q1.title': '¿El proyecto minero tiene licencia oficial?',
  'trust.faq.q1.content':
    'Sí. Minerales San Hilario S.C.R.L. opera bajo la licencia de concesión #070011405 emitida por INGEMMET (Instituto Geológico, Minero y Metalúrgico de Perú). La concesión cubre 8 km\u00B2 en Madre de Dios, Perú.',
  'trust.faq.q2.title': '¿Quién verificó los datos técnicos?',
  'trust.faq.q2.content':
    'El scoping study fue realizado por Timothy Strong BSc (Hons) de Kangari Consulting LLC, profesional calificado NI 43-101 con 15+ años de experiencia, y Liam Hardy BSc (Hons) de European Copper (EUCu.), con 12 años en exploración mineral.',
  'trust.faq.q3.title': '¿Cuánto potencial de oro ofrece el proyecto?',
  'trust.faq.q3.content':
    'Aproximadamente 344,000 oz de oro recuperable según el Scoping Study Fase 1 (mayo 2025). Es un objetivo de exploración conceptual, no una estimación formal de recursos minerales.',
  'trust.faq.q4.title': '¿Dónde puedo leer el informe técnico completo?',
  'trust.faq.q4.content':
    'El Scoping Study Fase 1 completo de EUCu. está disponible para descarga en la sección de Fundamento Técnico arriba.',
  'trust.faq.q5.title': '¿Dónde puedo verificar en la cadena?',
  'trust.faq.q5.content':
    'El contrato del token AYNI está desplegado en Ethereum mainnet. Puedes verificar todas las transacciones en Etherscan. Los informes de auditoría de PeckShield y CertiK también están públicamente disponibles.',
  'trust.faq.q6.title': '¿En qué blockchain está AYNI?',
  'trust.faq.q6.content':
    'AYNI es un token ERC-20 en Ethereum mainnet. Todos los tokens — AYNI y distribuciones PAXG — siguen el estándar ERC-20, compatibles con MetaMask, Trust Wallet, Ledger y cualquier billetera Ethereum.',
  'trust.faq.q7.title': '¿Cuál es la dirección del contrato del token?',
  'trust.faq.q7.content':
    'La dirección del contrato del token AYNI se muestra en la sección de Auditorías arriba. Puedes copiarla directamente o verla en Etherscan.',
  'trust.faq.q8.title': '¿Cómo se maneja la responsabilidad ambiental?',
  'trust.faq.q8.content':
    'La operación minera incluye planes de fitorremediación, iniciativas de agroforestería y una zona de producción de cacao como parte de su compromiso ambiental en la región de Madre de Dios.',
  'trust.faq.q9.title': '¿Cuáles son las entidades legales detrás de AYNI?',
  'trust.faq.q9.content':
    'AYNI TOKEN INC. es una International Business Company (IBC) constituida en las Islas Vírgenes Británicas (Empresa #2174797). Minerales San Hilario S.C.R.L. es una empresa minera registrada bajo ley peruana (RUC: 20606465255).',

  'trust.cta.title': '¿Listo para empezar?',
  'trust.cta.subtitle':
    'Únete a {{count}} participantes que reciben distribuciones respaldadas por oro',
  'trust.cta.button': 'Comenzar',

  'learn.trustBanner.text': '¿Quieres ver pruebas? Visita Confianza y Transparencia',

  // ── 404 ──
  'notFound.title': 'Página no encontrada',
  'notFound.goHome': 'Ir al inicio',

  // ── Payment methods ──
  'earn.paymentMethods.title': 'Método de pago',
  'earn.paymentMethods.tabCard': 'Tarjeta',
  'earn.paymentMethods.tabCrypto': 'Cripto',
  'earn.paymentMethods.currencyLabel': 'Moneda',
  'earn.paymentMethods.youllPay': 'Pagarás',
  'earn.paymentMethods.cardFee': 'Comisión de procesamiento:',
  'earn.paymentMethods.includedAbove': 'incluida arriba',

  // ── UI ──
  'ui.close': 'Cerrar',
  'ui.select.placeholder': 'Seleccionar...',
  'ui.notifications': 'Notificaciones',
  'ui.notificationsCount': '{{count}} notificaciones',

  // ── Notifications ──
  'notifications.title': 'Notificaciones',
  'notifications.empty': 'No hay notificaciones',
  'notifications.markAllRead': 'Marcar todo como leído',
  'notifications.markRead': 'Marcar como leído',
  'notifications.clearAll': 'Borrar todo',
  'notifications.marketplace_reserved': 'Tu listado ha sido reservado',
  'notifications.marketplace_completed': 'Transacción completada. Recibiste ${{amount}} USDC',
  'notifications.marketplace_expired': 'El listado expiró. Tokens descongelados.',
  'notifications.marketplace_purchased': 'Compraste {{amount}} AYNI',
  'notifications.listing_created': 'Listado creado por {{amount}} AYNI',
  'notifications.listing_cancelled': 'Tu listado ha sido cancelado',
  'notifications.participation_created':
    'Participación confirmada — {{amount}} AYNI por {{term}} meses',
  'notifications.position_cancelled': 'Posición cancelada exitosamente',
  'notifications.position_activated': '{{amount}} AYNI activados por {{term}} meses',
  'notifications.reinvest_completed': 'Reinversión de {{amount}} PAXG completada',
  'notifications.withdraw_completed': 'Retiro de {{amount}} procesado',
  'notifications.reward_credited': 'Distribución acreditada: {{amount}} PAXG',
  'notifications.welcome':
    'Bienvenido a AYNI! Comienza a participar para ganar recompensas respaldadas por oro.',
  'notifications.system': '{{message}}',

  // ── Greetings ──
  'greeting.morning': 'Buenos días',
  'greeting.afternoon': 'Buenas tardes',
  'greeting.evening': 'Buenas noches',
  'greeting.welcomeBack': 'Bienvenido de vuelta',

  // ── Auth ──
  'auth.title.register': 'Empieza a participar en la minería de oro',
  'auth.title.login': 'Bienvenido de vuelta',
  'auth.subtitle.register': 'Crea tu cuenta gratuita en 30 segundos',
  'auth.subtitle.login': 'Inicia sesión en tu cuenta',
  'auth.continueWithGoogle': 'Continuar con Google',
  'auth.continueWithApple': 'Continuar con Apple',
  'auth.or': 'o',
  'auth.emailLabel': 'Email',
  'auth.emailPlaceholder': 'tu@ejemplo.com',
  'auth.passwordLabel': 'Contraseña',
  'auth.passwordPlaceholder': 'Mín. 8 caracteres',
  'auth.continue': 'Continuar',
  'auth.signIn': 'Iniciar sesión',
  'auth.alreadyHaveAccount': '¿Ya tienes una cuenta? ',
  'auth.dontHaveAccount': '¿No tienes una cuenta? ',
  'auth.signInLink': 'Iniciar sesión',
  'auth.signUpLink': 'Registrarse',
  'auth.termsAgreement': 'Al registrarte aceptas nuestros ',
  'auth.termsLink': 'términos',
  'auth.and': ' y ',
  'auth.privacyLink': 'política de privacidad',
  'auth.validationEmail': 'Ingresa un email válido',
  'auth.validationPassword': 'La contraseña debe tener al menos 8 caracteres',
  'auth.genericError': 'Algo salió mal. Intenta de nuevo.',

  // ── Activity event templates ──
  'activity.event.dailyDistribution': 'Distribución diaria acreditada',
  'activity.event.maintenanceScheduled': 'Mantenimiento programado para {{date}}',
  'activity.event.positionConfirmed': 'Posición #{{number}} confirmada',
  'activity.event.monthlyPayout': 'Pago mensual completado',
  'activity.event.sentTo': 'Enviado a {{address}}',
  'activity.event.newTermAvailable': 'Nuevo plazo de {{term}} meses disponible',
  'activity.event.welcome': '¡Bienvenido a AYNI Gold!',
  'activity.event.platformLaunched': 'Plataforma v2.0 lanzada — nuevo panel y vistas de posiciones',
  'activity.event.positionActivated': '{{amount}} → {{ayni}} AYNI, activado por {{term}} meses',

  // ── Etiquetas de transacciones ──
  'activity.badge.deposit': 'depósito',
  'activity.badge.payout': 'pago',
  'activity.badge.reward': 'distribución',
  'activity.badge.system': 'sistema',

  // ── Subtotales de grupo ──
  'activity.group.subtotal': 'Total: +{{income}} / −{{expense}}',

  // ── Risk table rows ──
  'trust.risks.miningOutput': 'Variabilidad de producción minera',
  'trust.risks.miningOutputDesc':
    'La producción de oro varía según condiciones geológicas, clima, equipos',
  'trust.risks.miningOutputMit':
    'Diversificación entre zonas mineras, programa de mantenimiento de equipos',
  'trust.risks.goldPrice': 'Volatilidad del precio del oro',
  'trust.risks.goldPriceDesc': 'El valor de PAXG está vinculado al precio spot del oro',
  'trust.risks.goldPriceMit':
    'Distribuciones en token respaldado por oro, no en activo especulativo',
  'trust.risks.tokenPrice': 'Riesgo de precio del token',
  'trust.risks.tokenPriceDesc': 'El precio de AYNI está determinado por el mercado',
  'trust.risks.tokenPriceMit':
    'El token es un instrumento de utilidad, no un vehículo especulativo',
  'trust.risks.regulatory': 'Riesgo regulatorio',
  'trust.risks.regulatoryDesc': 'La regulación cripto está evolucionando',
  'trust.risks.regulatoryMit': 'Incorporación en BVI, cumplimiento de licencia minera peruana',
  'trust.risks.operational': 'Riesgo operacional',
  'trust.risks.operationalDesc': 'Falla de equipos, interrupción de acceso',
  'trust.risks.operationalMit':
    'Fondo de estabilidad, programa de mantenimiento, equipos de respaldo',
  'trust.risks.liquidity': 'Riesgo de liquidez',
  'trust.risks.liquidityDesc': 'Liquidez limitada en DEX',
  'trust.risks.liquidityMit': 'Enfoque en participación a largo plazo, no en trading',

  // ── Mine level equipment ──
  'mine.equip.basicPickaxe': 'Pico y batea básicos',
  'mine.equip.sluiceBox': 'Canalón y herramientas manuales',
  'mine.equip.excavatorConveyor': 'Excavadora y cinta transportadora',
  'mine.equip.multiLine': 'Procesamiento multi-línea',
  'mine.equip.fullIndustrial': 'Complejo industrial completo',

  // ── Mine achievements (17 total) ──
  'mine.achievement.firstParticipation': 'Primera Participación',
  'mine.achievement.firstParticipationDesc': 'Realizaste tu primera participación',
  'mine.achievement.firstGold': 'Primer Oro',
  'mine.achievement.firstGoldDesc': 'Recibiste tu primera distribución diaria',
  'mine.achievement.streak7': 'Racha de 7 Días',
  'mine.achievement.streak7Desc': 'Reclamaste oro 7 días seguidos',
  'mine.achievement.streak14': 'Racha de 14 Días',
  'mine.achievement.streak14Desc': 'Reclamaste oro 14 días seguidos',
  'mine.achievement.streak30': 'Racha de 30 Días',
  'mine.achievement.streak30Desc': 'Reclamaste oro 30 días seguidos',
  'mine.achievement.streak60': 'Racha de 60 Días',
  'mine.achievement.streak60Desc': 'Reclamaste oro 60 días seguidos',
  'mine.achievement.participate1000': 'Participante $1,000',
  'mine.achievement.participate1000Desc': 'Participación total alcanzó $1,000',
  'mine.achievement.participate5000': 'Participante $5,000',
  'mine.achievement.participate5000Desc': 'Participación total alcanzó $5,000',
  'mine.achievement.participate25000': 'Participante $25,000',
  'mine.achievement.participate25000Desc': 'Participación total alcanzó $25,000',
  'mine.achievement.payday': '¡Día de Pago!',
  'mine.achievement.paydayDesc': 'Recibiste tu primer pago trimestral',
  'mine.achievement.gold1g': '1g de Oro Minado',
  'mine.achievement.gold1gDesc': 'Producción acumulada alcanzó 1 gramo',
  'mine.achievement.gold10g': '10g de Oro Minado',
  'mine.achievement.gold10gDesc': 'Producción acumulada alcanzó 10 gramos',
  'mine.achievement.gold100g': '100g de Oro Minado',
  'mine.achievement.gold100gDesc': 'Producción acumulada alcanzó 100 gramos',
  'mine.achievement.level2': 'Prospector',
  'mine.achievement.level2Desc': 'Alcanzaste el Nivel 2 de mina',
  'mine.achievement.level3': 'Operador',
  'mine.achievement.level3Desc': 'Alcanzaste el Nivel 3 de mina',
  'mine.achievement.level4': 'Jefe de Campamento',
  'mine.achievement.level4Desc': 'Alcanzaste el Nivel 4 de mina',
  'mine.achievement.level5': 'Emperador del Oro',
  'mine.achievement.level5Desc': 'Alcanzaste el Nivel 5 — nivel máximo',
  'mine.achievements.count': '{{unlocked}} / {{total}} desbloqueados',
  'mine.achievements.categoryAll': 'Todos',
  'mine.achievements.categoryExplorer': 'Explorador',
  'mine.achievements.categoryMiner': 'Minero',
  'mine.achievements.categoryInvestor': 'Participante',
  'mine.achievements.categoryVeteran': 'Veterano',

  // ── Mine timeline (dynamic) ──
  'mine.timeline.positionCreated': 'Nueva participación iniciada',
  'mine.timeline.payoutReceived': 'Pago trimestral recibido',

  // ── Streak calendar ──
  'mine.calendar.title': 'Actividad minera',
  'mine.calendar.claimed': 'Reclamado',
  'mine.calendar.missed': 'Perdido',
  'mine.calendar.upcoming': 'Próximo',
  'mine.calendar.less': 'Menos',
  'mine.calendar.more': 'Más',
  'mine.calendar.ariaLabel':
    'Actividad minera: {{claimed}} días reclamados en las últimas {{weeks}} semanas. Racha actual: {{streak}} días.',

  // ── Milestone timeline ──
  'mine.milestone.title': 'Tu recorrido',

  // ── Claim button ──
  'home.claim.title': 'Reclama el oro de hoy',
  'home.claim.button': 'Reclamar',
  'home.claim.claimed': '¡Reclamado hoy!',
  'home.claim.ariaClaimable': 'Reclama tu distribución diaria de oro',
  'home.claim.ariaClaimed': 'Oro diario ya reclamado. {{grams}} acumulados hoy.',

  // ── Mine illustration ──
  'mine.illustration.miningInProgress': 'Minería en progreso',

  // ── Trust data: equipment names ──
  'trust.data.excavators': 'Excavadoras',
  'trust.data.loaders': 'Cargadores',
  'trust.data.dumpTrucks': 'Camiones volquete',
  'trust.data.scrubberTrommels': 'Unidades scrubber-trommel',
  'trust.data.goldSeparation': 'Equipo de separación de oro',
  'trust.data.goldSeparationDesc': 'Gravimétrico, equipo completo',
  'trust.data.residentialFacilities': 'Instalaciones residenciales',
  'trust.data.residentialFacilitiesDesc': 'En sitio para equipos operativos',

  // ── Trust data: scoping study ──
  'trust.data.scopingTitle': 'Scoping Study Fase 1',
  'trust.data.preDevelopment': 'Pre-desarrollo',

  // ── Trust data: monthly labels ──
  'trust.data.month.jul2025': 'Jul 2025',
  'trust.data.month.aug2025': 'Ago 2025',
  'trust.data.month.sep2025': 'Sep 2025',
  'trust.data.month.oct2025': 'Oct 2025',
  'trust.data.month.nov2025': 'Nov 2025',
  'trust.data.month.dec2025': 'Dic 2025',

  // ── Photo alt texts ──
  'trust.data.photo.siteOverview': 'Vista aérea del sitio minero',
  'trust.data.photo.processingPlant': 'Planta de procesamiento de oro',
  'trust.data.photo.excavation': 'Operaciones de excavación',

  // ── Roadmap milestones ──
  'trust.data.roadmap.acquisition': 'Adquisición de concesión',
  'trust.data.roadmap.engineering': 'Ingeniería y diseño del proyecto',
  'trust.data.roadmap.procurement': 'Adquisición de equipos',
  'trust.data.roadmap.installation': 'Instalación y prueba piloto',

  // ── Remaining UI strings ──
  'settings.toggleAdvancedView': 'Alternar vista avanzada',
  'earn.advanced.acquiringTokens': 'Estás adquiriendo {{count}} tokens AYNI',
  'earn.checkout.title': 'Pago',

  // ── Tokenomics ──
  'resources.tab.tokenomics': 'Tokenomics',

  'tokenomics.hero.title': 'AYNI Gold',
  'tokenomics.hero.subtitle':
    'Token utilitario ERC-20 vinculado a la capacidad real de minería en las concesiones de Minerales SH en Perú.',
  'tokenomics.hero.paramToken': 'Token:',
  'tokenomics.hero.paramTokenValue': 'Ayni Gold',
  'tokenomics.hero.paramTicker': 'Ticker:',
  'tokenomics.hero.paramTickerValue': 'AYNI',
  'tokenomics.hero.paramStandard': 'Estándar:',
  'tokenomics.hero.paramStandardValue': 'ERC-20 (Ethereum)',
  'tokenomics.hero.paramSupply': 'Suministro total:',
  'tokenomics.hero.paramSupplyValue': '806.451.613',
  'tokenomics.hero.vestingNote':
    'Los tokens del equipo y asesores están sujetos a un calendario de vesting para alineación a largo plazo.',

  'tokenomics.allocation.sales': 'Ventas y Fondos',
  'tokenomics.allocation.reserve': 'Fondo de Reserva',
  'tokenomics.allocation.team': 'Equipo',
  'tokenomics.allocation.advisor': 'Junta Asesora',
  'tokenomics.allocation.community': 'Airdrops y Comunidad',

  'tokenomics.howItWorks.title': 'Cómo funciona el token',
  'tokenomics.howItWorks.card1Title': 'Vinculado a la minería',
  'tokenomics.howItWorks.card1Text':
    'Cada AYNI = 4 cm³/hora de capacidad minera real en una concesión de oro en Perú. El token está vinculado a operaciones físicas, no a un mercado especulativo.',
  'tokenomics.howItWorks.card2Title': 'Distribuciones en PAXG',
  'tokenomics.howItWorks.card2Text':
    'Los participantes reciben distribuciones trimestrales en PAXG — un token respaldado por oro físico (Paxos Trust). Los cálculos se basan en datos reales de producción.',
  'tokenomics.howItWorks.card3Title': 'Gobernanza (DAO)',
  'tokenomics.howItWorks.card3Text':
    'Los poseedores de AYNI participan en la gobernanza del proyecto a través de DAO. Votaciones sobre decisiones clave: porcentaje de Success Fee, alianzas estratégicas, cuestiones operativas.',

  'tokenomics.burn.sectionTitle': 'Mecanismo deflacionario',
  'tokenomics.burn.description':
    'El 15% de los Success Fees recaudados se destinan a la recompra de AYNI en el mercado abierto y su quema permanente (envío a la dirección cero en Ethereum). La operación se realiza trimestralmente, los resultados son verificables on-chain.',
  'tokenomics.burn.totalBurned': 'Total quemado histórico',
  'tokenomics.burn.lastQuarterBurn': 'Última quema trimestral',
  'tokenomics.burn.circulatingSupply': 'Suministro circulante actual',
  'tokenomics.burn.unit': 'AYNI',
  'tokenomics.burn.firstBurnNote': 'Primera quema programada tras el próximo trimestre',
  'tokenomics.burn.historyTitle': 'Historial de quemas',
  'tokenomics.burn.colQuarter': 'Trimestre',
  'tokenomics.burn.colDate': 'Fecha',
  'tokenomics.burn.colVolume': 'Volumen (AYNI)',
  'tokenomics.burn.colTxHash': 'Tx hash',
  'tokenomics.burn.colSupplyAfter': 'Suministro después',
  'tokenomics.burn.emptyTitle':
    'Los datos de quema aparecerán después de la primera operación trimestral.',
  'tokenomics.burn.emptyLink': 'Cómo funciona el mecanismo →',
  'tokenomics.burn.disclaimer':
    'El mecanismo de quema busca reducir gradualmente el suministro circulante de tokens. Esto no es una garantía de aumento de precio. El precio de AYNI está determinado por factores de mercado y puede fluctuar. Todas las operaciones son verificables en la blockchain de Ethereum.',

  'tokenomics.formula.sectionTitle': 'Cálculo de distribuciones',
  'tokenomics.formula.subtitle':
    'Las distribuciones se calculan trimestralmente usando una fórmula basada en datos reales de producción:',
  'tokenomics.formula.formula':
    'Distribución (PAXG) = Producción (g) − Costos (USD) − Success Fee (g)',
  'tokenomics.formula.block1Title': 'Producción (g)',
  'tokenomics.formula.block1Formula':
    'Número de tokens × Capacidad minera × Contenido de oro × Horas operativas',
  'tokenomics.formula.block1ParamCapacity': 'Capacidad minera',
  'tokenomics.formula.block1ParamCapacityValue': '0,000004 m³/hora (4 cm³/hora)',
  'tokenomics.formula.block1ParamGold': 'Contenido de oro',
  'tokenomics.formula.block1ParamGoldValue': '0,1 g/m³',
  'tokenomics.formula.block1ParamHours': 'Horas operativas',
  'tokenomics.formula.block1ParamHoursValue': '16 horas/día',
  'tokenomics.formula.block2Title': 'Costos (USD)',
  'tokenomics.formula.block2Formula': 'OPEX por m³ × Horas diarias × Tokens × Capacidad del token',
  'tokenomics.formula.block2ParamOpex': 'OPEX por m³',
  'tokenomics.formula.block2ParamOpexValue': '$5,92',
  'tokenomics.formula.block3Title': 'Success Fee',
  'tokenomics.formula.block3Formula': '(Producción − Costos) × % Success Fee',
  'tokenomics.formula.block3Note':
    'Cuanto mayor sea el monto de participación y más largo el plazo, menor será la comisión de la plataforma.',

  'tokenomics.fee.col1mo': '1 mes',
  'tokenomics.fee.col12mo': '12 meses',
  'tokenomics.fee.col24mo': '24 meses',
  'tokenomics.fee.col36mo': '36 meses',
  'tokenomics.fee.col48mo': '48 meses',
  'tokenomics.fee.levelLabel': 'Nivel (USD)',

  'tokenomics.example.title': 'Ejemplo de cálculo para 10.000 AYNI (1 día)',
  'tokenomics.example.goldProduction': 'Producción de oro',
  'tokenomics.example.costs': 'Costos (en oro)',
  'tokenomics.example.beforeFee': 'Antes de deducción de comisión',
  'tokenomics.example.successFee': 'Success Fee (20%)',
  'tokenomics.example.finalDistribution': 'Distribución final',

  'tokenomics.footer.disclaimer':
    'AYNI es un token utilitario. La propiedad de tokens no confiere participación accionaria, dividendos ni derechos de propiedad sobre oro, equipos o infraestructura minera. Las distribuciones se basan en datos de producción y no están garantizadas. Detalles en el Whitepaper y Términos de Uso.',

  // ── Marketplace page ──
  'marketplace.page.title': 'Marketplace de participantes',
  'marketplace.page.subtitle': 'Compre AYNI directamente de otros participantes',
  'marketplace.page.createListing': 'Crear listado',
  'marketplace.page.disclaimer':
    'Los precios del marketplace son establecidos por los participantes. AYNI TOKEN INC. proporciona únicamente la infraestructura técnica.',
  'marketplace.stats.activeListings': 'Listados activos',
  'marketplace.stats.totalVolume': 'Volumen total',
  'marketplace.stats.avgDeviation': 'Desviación prom.',
  'marketplace.stats.avgTimeToFill': 'Tiempo prom. de venta',
  'marketplace.stats.days': '{{count}} días',

  // ── Marketplace ──
  'marketplace.listing.statusActive': 'Activo',
  'marketplace.listing.statusReserved': 'Reservado',
  'marketplace.listing.statusCompleted': 'Completado',
  'marketplace.listing.statusExpired': 'Expirado',
  'marketplace.listing.statusCancelled': 'Cancelado',
  'marketplace.listing.discount': 'descuento',
  'marketplace.listing.premium': 'prima',
  'marketplace.listing.atMarket': 'a mercado',
  'marketplace.listing.positionAge': '{{months}} meses en posición',
  'marketplace.listing.payouts': '{{count}} pagos',
  'marketplace.listing.expires': 'Expira: {{days}} días',
  'marketplace.listing.activePosition': 'Posición activa',
  'marketplace.listing.remainingTerm': '{{months}} meses restantes',

  // Marketplace filters
  'marketplace.filters.lotSizeLabel': 'Tamaño del lote',
  'marketplace.filters.lotAll': 'Todos',
  'marketplace.filters.lotSmall': 'S < $1.5k',
  'marketplace.filters.lotMedium': 'M $1.5‑15k',
  'marketplace.filters.lotLarge': 'L > $15k',
  'marketplace.filters.priceLabel': 'Precio',
  'marketplace.filters.priceAll': 'Todos',
  'marketplace.filters.priceDiscount': 'Con descuento',
  'marketplace.filters.priceAtMarket': 'A mercado',
  'marketplace.filters.pricePremium': 'Con prima',
  'marketplace.filters.sortLabel': 'Ordenar',
  'marketplace.filters.sortNewest': 'Más recientes',
  'marketplace.filters.sortPriceLow': 'Precio ↑',
  'marketplace.filters.sortPriceHigh': 'Precio ↓',
  'marketplace.filters.sortAmountHigh': 'Volumen ↓',

  // Marketplace grid
  'marketplace.grid.empty': 'Aún no hay listados',
  'marketplace.grid.createFirst': 'Crear primer listado',

  // Marketplace detail page
  'marketplace.detail.backToListings': 'Volver a listados',
  'marketplace.detail.notFound': 'Listado no encontrado',
  'marketplace.detail.positionHistory': 'Historial de posición',
  'marketplace.detail.stakedSince': 'En posición desde',
  'marketplace.detail.quartersPaid': 'Trimestres pagados',
  'marketplace.detail.totalPaxgEarned': 'PAXG ganado',
  'marketplace.detail.positionDuration': 'Duración de posición',
  'marketplace.detail.months': '{{count}} meses',
  'marketplace.detail.aboutSeller': 'Sobre el vendedor',
  'marketplace.detail.kycEnhanced': 'KYC avanzado',
  'marketplace.detail.kycStandard': 'KYC estándar',
  'marketplace.detail.completionRate': '{{rate}}% completado',
  'marketplace.detail.totalDeals': '{{count}} acuerdos',
  'marketplace.detail.escrowLocked': 'Tokens bloqueados en custodia',
  'marketplace.detail.escrowHint': 'Los fondos están protegidos hasta completar la transacción',
  'marketplace.detail.acquire': 'Adquirir {{amount}} AYNI',
  'marketplace.detail.amount': 'Monto',
  'marketplace.detail.commission': 'Comisión ({{rate}}%)',
  'marketplace.detail.total': 'Total',
  'marketplace.detail.cta': 'Obtener {{total}} en AYNI',
  'marketplace.detail.ctaHint': 'Después de la compra podrás activar la participación',
  'marketplace.detail.confirmTitle': 'Confirmar compra',
  'marketplace.detail.summaryAmount': 'Cantidad de AYNI',
  'marketplace.detail.summaryPrice': 'Precio',
  'marketplace.detail.paymentMethod': 'Método de pago',
  'marketplace.detail.confirmPurchase': 'Confirmar compra',
  'marketplace.detail.successTitle': '¡Compra exitosa!',
  'marketplace.detail.successMessage':
    'Has adquirido {{amount}} AYNI. ¿Deseas activar la participación ahora?',
  'marketplace.detail.activateNow': 'Activar participación',
  'marketplace.detail.maybeLater': 'Quizás después',
  'marketplace.detail.activePositionBanner': 'Posición activa',
  'marketplace.detail.activePositionHint':
    'Esta es una posición activa. Heredarás los {{months}} meses restantes y seguirás recibiendo distribuciones.',
  'marketplace.detail.remainingTerm': 'Plazo restante',

  // ── Tiers ──
  'tiers.explorer': 'Explorador',
  'tiers.contributor': 'Contribuidor',
  'tiers.operator': 'Operador',
  'tiers.principal': 'Principal',

  // Tier perks — Explorer
  'tiers.explorer.perk1': 'Calendario estándar de distribuciones',
  'tiers.explorer.perk2': 'Resumen básico de la actividad minera',
  'tiers.explorer.perk3': 'Soporte por email',
  // Tier perks — Contributor
  'tiers.contributor.perk1': '5% de reducción en Success Fee',
  'tiers.contributor.perk2': 'Analítica minera extendida',
  'tiers.contributor.perk3': 'Cola de soporte prioritaria',
  'tiers.contributor.perk4': 'Informes trimestrales de concesión',
  // Tier perks — Operator
  'tiers.operator.perk1': '10% de reducción en Success Fee',
  'tiers.operator.perk2': 'Informes detallados con geodatos',
  'tiers.operator.perk3': 'Acceso anticipado a nuevas posiciones',
  'tiers.operator.perk4': 'Canal de soporte dedicado',
  'tiers.operator.perk5': 'Acceso a la comunidad privada Operator',
  // Tier perks — Principal
  'tiers.principal.perk1': '15% de reducción en Success Fee',
  'tiers.principal.perk2': 'Gestor de cuenta personal',
  'tiers.principal.perk3': 'Acceso prioritario OTC',
  'tiers.principal.perk4': 'Acceso directo a AMA con liderazgo',
  'tiers.principal.perk5': 'Sesiones de hoja de ruta',
  'tiers.principal.perk6': 'Incorporación personalizada para nuevas posiciones',

  // ── TierCard ──
  'tierCard.header': 'Estado del participante',
  'tierCard.miningPower': 'Potencia minera:',
  'tierCard.loadError': 'No se pudo cargar el estado del participante',
  'tierCard.maxTier': 'Nivel máximo — Principal',
  'tierCard.progressTo': 'Progreso hacia {{tier}}',
  'tierCard.needAyniAndMonths': 'Necesitas {{ayni}} AYNI + {{months}} meses más',
  'tierCard.needAyni': 'Necesitas {{ayni}} AYNI más',
  'tierCard.needMonths': 'Necesitas {{months}} meses más',
  'tierCard.requirementsMet': 'Requisitos cumplidos',
  'tierCard.statusRetained': 'Estado retenido de participación anterior',
  'tierCard.statusLifetime': 'Estado mantenido por asignación de oro acumulada',
  'tierCard.viewBenefits': 'Ver todos los beneficios →',

  // ── ContributorStatus ──
  'contributorStatus.title': 'Estado de contribuidor',
  'contributorStatus.pathTo': 'Camino hacia {{tier}}',
  'contributorStatus.ayniPosition': 'Posición AYNI',
  'contributorStatus.participationPeriod': 'Período de participación',
  'contributorStatus.requirementMet': 'Requisito de {{label}} cumplido',
  'contributorStatus.statusPreserved':
    'Tu estado de {{tier}} está preservado. Aumenta tu posición para continuar el progreso hacia {{nextTier}}.',
  'contributorStatus.statusLifetime':
    'Tu estado de {{tier}} se mantiene por tu asignación de oro acumulada.',
  'contributorStatus.tableTier': 'Nivel',
  'contributorStatus.tableMinPosition': 'Posición mín.',
  'contributorStatus.tableMinPeriod': 'Período mín.',
  'contributorStatus.tableFeeReduction': 'Reducción de Fee',
  'contributorStatus.tableKeyBenefit': 'Beneficio clave',
  'contributorStatus.currentBadge': 'Actual',
  'contributorStatus.months': '{{count}} meses',
  'contributorStatus.reachTier': 'Alcanza {{tier}}: agrega {{amount}} AYNI a tu posición',
  'contributorStatus.reachTierMonthsOnly':
    '¡Requisito de AYNI para {{tier}} cumplido! Faltan {{months}} meses más de participación.',
  'contributorStatus.reachTierBoth':
    'Alcanza {{tier}}: agrega {{amount}} AYNI y participa {{months}} meses más',
  'contributorStatus.addToPosition': 'Aumentar posición',

  // ── ContributorTiersSection ──
  'contributorTiers.title': 'Niveles de participantes',
  'contributorTiers.subtitle': 'Cómo se calcula tu nivel y qué beneficios desbloquea',
  'contributorTiers.seeFullStatus': 'Ver estado completo →',
  'contributorTiers.howTiersWork': 'Cómo funcionan los niveles',
  'contributorTiers.howTiersWorkP1':
    'Tu nivel se determina por dos factores: el volumen de tu posición bloqueada de AYNI y la duración de tu período de participación. Los niveles más altos desbloquean comisiones reducidas y beneficios adicionales.',
  'contributorTiers.howTiersWorkP2':
    'La potencia minera representa tu parte de la capacidad de procesamiento de mineral en las concesiones de AYNI. 1 AYNI = 4 cm³/hora. Es una métrica técnica de participación en la minería de oro, no un indicador financiero.',
  'contributorTiers.noMinRequirements': 'Sin requisitos mínimos',
  'contributorTiers.tierRequirements': '{{ayni}} AYNI · {{months}} meses',
  'contributorTiers.faqTitle': 'Preguntas frecuentes',
  'contributorTiers.faq.howDetermined.title': '¿Cómo se determina mi nivel?',
  'contributorTiers.faq.howDetermined.content':
    'Tu nivel se basa en el volumen combinado de tu posición bloqueada de AYNI y la duración de tu participación.',
  'contributorTiers.faq.loseTier.title': '¿Perderé mi nivel si cierro una posición?',
  'contributorTiers.faq.loseTier.content':
    'No. Una vez alcanzado un nivel, se retiene permanentemente, incluso si tu posición activa disminuye. Tu nivel refleja tu historial de participación.',
  'contributorTiers.faq.whatIsMiningPower.title': '¿Qué es la potencia minera?',
  'contributorTiers.faq.whatIsMiningPower.content':
    'La potencia minera representa tu parte de la capacidad de procesamiento de mineral en las concesiones de AYNI. 1 AYNI = 4 cm³/hora. Es una medida técnica de participación en la minería de oro, no una métrica financiera.',
  'contributorTiers.faq.whenUpdate.title':
    '¿Cuándo se actualiza mi nivel después de aumentar mi posición?',
  'contributorTiers.faq.whenUpdate.content':
    'Las actualizaciones de nivel se procesan dentro de las 24 horas posteriores a la confirmación de tu posición.',

  // ── Liquidity Window ──
  'marketplace.liquidity.openTitle': 'Ventana de liquidez abierta',
  'marketplace.liquidity.countdown': '{{time}} restante',
  'marketplace.liquidity.applyCta': 'Solicitar ahora',
  'marketplace.liquidity.closedTitle': 'Próxima ventana: {{date}}',
  'marketplace.liquidity.closedSubtitle': 'Coincide con la distribución trimestral de PAXG',

  // ── Activity Ticker ──
  'ticker.live': 'En vivo',
  'ticker.investment': '{{city}} — alguien acaba de participar con {{amount}}',
  'ticker.earning': 'Un participante ganó {{grams}} de oro hoy',
  'ticker.payout': '{{city}} — pago trimestral de {{amount}} recibido',
  'ticker.timeAgo.justNow': 'Ahora',
  'ticker.timeAgo.minutes': 'hace {{count}}m',
  'ticker.timeAgo.hours': 'hace {{count}}h',

  // ── Notification Preferences ──
  'settings.group.notificationPreferences': 'Preferencias de notificación',
  'settings.notifications.dailyEarnings': 'Resumen de distribuciones diarias',
  'settings.notifications.dailyEarningsHelper': 'Recibe notificaciones de tus distribuciones diarias en oro',
  'settings.notifications.streaks': 'Hitos de racha',
  'settings.notifications.streaksHelper': 'Celebra días consecutivos de actividad',
  'settings.notifications.priceAlerts': 'Alertas de precio',
  'settings.notifications.priceAlertsHelper': 'Recibe notificaciones sobre movimientos significativos del precio del oro',

  // ── Comparison Table ──
  'comparison.title': 'Cómo se compara AYNI',
  'comparison.subtitle': 'Mira cómo podrían rendir tus {{amount}}',
  'comparison.col.yield': 'Producción anual est.',
  'comparison.col.earnings': 'Producción en {{months}} meses',
  'comparison.col.backing': 'Respaldado por',
  'comparison.col.payout': 'Pago',
  'comparison.bank.name': 'Ahorro bancario',
  'comparison.paxg.name': 'PAXG (Mantener)',
  'comparison.sp500.name': 'S&P 500',
  'comparison.defi.name': 'DeFi Yield',
  'comparison.backing.mining': 'Minería de oro real',
  'comparison.backing.fdic': 'Asegurado FDIC',
  'comparison.backing.goldPrice': 'Precio del oro',
  'comparison.backing.stocks': 'Acciones EE.UU.',
  'comparison.backing.smartContract': 'Contratos inteligentes',
  'comparison.payout.quarterly': 'Trimestral (PAXG)',
  'comparison.payout.monthly': 'Mensual',
  'comparison.payout.na': 'N/A',
  'comparison.payout.dividends': 'Distribuciones',
  'comparison.payout.variable': 'Variable',
  'comparison.disclaimer': 'La comparación es ilustrativa. La producción pasada no garantiza resultados futuros.',

  // ── Demo Position ──
  'demo.position.title': 'Tu posición demo',
  'demo.position.badge': 'Demo',
  'demo.position.dayProgress': 'Día {{day}} de {{total}}',
  'demo.position.earned': 'Habrías ganado ~{{amount}} ({{grams}})',
  'demo.position.complete': 'En 7 días habrías recibido {{amount}}. ¿Listo para distribuciones reales?',
  'demo.position.cta': 'Comienza a participar de verdad',

  // ── Auto-Reinvest ──
  'settings.group.autoReinvest': 'Auto-Reinversión',
  'autoReinvest.enable': 'Activar auto-reinversión',
  'autoReinvest.enableHelper': 'Convertir automáticamente pagos trimestrales de PAXG en nuevas posiciones AYNI',
  'autoReinvest.term': 'Plazo de bloqueo predeterminado',
  'autoReinvest.feeNote': 'Comisión de swap por reinversión',
  'autoReinvest.active': 'Auto-reinversión',
  'autoReinvest.activity': 'Auto-reinvertido {{paxg}} PAXG → {{ayni}} AYNI',

  // ── Live Mine Dashboard ──
  'mine.live.label': 'En vivo',
  'mine.live.subtitle': '≈ {{usd}} hoy',
  'mine.live.title': 'Producción en vivo',
  'mine.operations.title': 'Operaciones mineras',
  'mine.operations.location': 'Ubicación',
  'mine.operations.concession': 'Área de concesión',
  'mine.operations.equipment': 'Unidades de equipo',
  'mine.operations.since': 'Operando desde',
  'mine.operations.license': 'Licencia minera',
  'mine.chart.title': 'Producción 7 días',
  'mine.chart.grams': 'Gramos',
  'mine.chart.noData': 'Avanza días para ver datos de producción',

  // ── Referral Program ──
  'referral.title': 'Programa de Referidos',
  'referral.subtitle': 'Gana AYNI por cada amigo que participe',
  'referral.yourCode': 'Tu código de referido',
  'referral.copyLink': 'Copiar enlace',
  'referral.copied': '¡Copiado!',
  'referral.shareTitle': 'Únete a AYNI Gold',
  'referral.shareText': 'Recibe distribuciones respaldadas por oro con AYNI. Usa mi código: {{code}}',
  'referral.stats.totalReferred': 'Total referidos',
  'referral.stats.completed': 'Completados',
  'referral.stats.bonusEarned': 'AYNI ganado',
  'referral.history.title': 'Historial de referidos',
  'referral.history.empty': 'Aún no tienes referidos',
  'referral.history.emptyHint': 'Comparte tu código y gana {{bonus}} AYNI por amigo',
  'referral.history.pending': 'Esperando participación',
  'referral.history.completed': 'Participación confirmada',
  'referral.bonus': '+{{amount}} AYNI',
  'referral.howItWorks': 'Cómo funciona',
  'referral.step1': 'Comparte tu enlace único de referido',
  'referral.step2': 'Tu amigo se registra y participa',
  'referral.step3': 'Ambos ganan {{bonus}} AYNI de bono',
  'referral.simulate': 'Simular referido',
  'referral.simulateHelper': 'Demo: simula un amigo uniéndose por tu enlace',

  // ── Learn-to-Earn ──
  'learn.earn.title': 'Aprende y Gana',
  'learn.earn.subtitle': 'Completa módulos para recibir tokens AYNI',
  'learn.earn.progress': 'Tu progreso',
  'learn.earn.completed': '{{count}} de {{total}} completados',
  'learn.earn.totalEarned': 'Total ganado',
  'learn.earn.claimAll': 'Reclamar {{amount}} AYNI',
  'learn.earn.claimed': 'Reclamado',
  'learn.earn.reward': '+{{amount}} AYNI',
  'learn.earn.pendingClaim': 'Reclamar distribución',
  'learn.earn.locked': 'Completa para desbloquear',
  'learn.quiz.title': 'Cuestionario',
  'learn.quiz.correct': '¡Correcto! Bien hecho.',
  'learn.quiz.incorrect': 'No del todo. ¡Inténtalo de nuevo!',
  'learn.quiz.question': 'Pregunta {{current}} de {{total}}',
  'learn.quiz.submit': 'Enviar respuesta',
  'learn.quiz.next': 'Siguiente pregunta',
  'learn.quiz.complete': '¡Cuestionario completado!',
  'learn.quiz.score': 'Obtuviste {{score}} de {{total}}',
  'learn.quiz.passMessage': '¡Aprobaste! Reclama tu distribución.',
  'learn.quiz.failMessage': 'Necesitas {{required}} correctas para aprobar. ¡Inténtalo de nuevo!',
  'learn.quiz.retry': 'Reintentar cuestionario',
  'learn.reward.toast': '+{{amount}} AYNI ganado!',

  // ── Card ──
  'card.page.title': 'Tarjeta Gold AYNI',
  'card.page.back': 'Configuración',

  'card.promo.title': 'Tarjeta Gold AYNI',
  'card.promo.subtitle': 'Gasta tus distribuciones de oro en todo el mundo',
  'card.promo.progress': 'Progreso hacia la elegibilidad',
  'card.promo.lockMore': 'Bloquea {{remaining}} AYNI más',
  'card.promo.cta': 'Abrir una posición',
  'card.promo.eligibility': 'Alcanza el nivel Contributor para desbloquear tu tarjeta',
  'card.promo.ayniLocked': 'AYNI bloqueados',
  'card.promo.alsoRequires': 'También requiere posición de 6+ meses',
  'card.promo.howItWorks': 'Cómo funciona',
  'card.promo.step1': 'Abre una posición y bloquea tokens AYNI — alcanza nivel Contributor',
  'card.promo.step2': 'Completa la verificación de identidad (KYC)',
  'card.promo.step3': 'Recibe tu tarjeta Visa virtual al instante',
  'card.promo.step4': 'Convierte distribuciones PAXG a EUR y gasta en todo el mundo',
  'card.promo.step5': 'Sube de nivel para mayores límites y tarjeta física',

  'card.dashboard.balance': 'Saldo disponible',
  'card.dashboard.topUp': 'Recargar',
  'card.dashboard.freeze': 'Congelar',
  'card.dashboard.unfreeze': 'Descongelar',
  'card.dashboard.wallet': 'Billetera',
  'card.dashboard.settings': 'Ajustes',
  'card.dashboard.limits': 'Límites',
  'card.dashboard.details': 'Detalles',
  'card.dashboard.recentActivity': 'Actividad reciente',
  'card.dashboard.frozenTitle': 'Tarjeta congelada',
  'card.dashboard.frozenDesc': 'Tu tarjeta está temporalmente congelada. Descongela para realizar transacciones.',
  'card.dashboard.ofMonth': '€{{spent}} de €{{limit}} este mes',
  'card.dashboard.cardNumber': 'Número de tarjeta',
  'card.dashboard.expiry': 'Vencimiento',
  'card.dashboard.cvv': 'CVV',
  'card.dashboard.cardholder': 'Titular',
  'card.dashboard.detailsAutoHide': 'Los detalles se ocultarán en 10 segundos',
  'card.dashboard.spendingLimits': 'Límites de gasto',

  'card.topUp.title': 'Recargar saldo',
  'card.topUp.description': 'Convierte PAXG a saldo de tarjeta',
  'card.topUp.paxgBalance': 'Saldo PAXG',
  'card.topUp.amountLabel': 'Cantidad PAXG',
  'card.topUp.available': 'Disponible',
  'card.topUp.conversion': 'Conversión',
  'card.topUp.fee': 'Comisión de conversión',
  'card.topUp.youReceive': 'Recibes',
  'card.topUp.goldPrice': 'Precio del oro',
  'card.topUp.grossAmount': 'Monto bruto',
  'card.topUp.monthlyUsed': 'Recarga mensual usada',
  'card.topUp.afterTopup': 'Después de esta recarga',
  'card.topUp.insufficientPaxg': 'Saldo PAXG insuficiente',
  'card.topUp.cta': 'Convertir y recargar',
  'card.topUp.successTitle': 'Recarga exitosa',
  'card.topUp.successDesc': '€{{amount}} añadido a tu tarjeta',
  'card.topUp.done': 'Listo',

  'card.tx.empty': 'Sin transacciones',
  'card.tx.all': 'Todas',
  'card.tx.purchases': 'Compras',
  'card.tx.topups': 'Recargas',
  'card.tx.cashback': 'Cashback',
  'card.tx.showAll': 'Ver todas las transacciones',
  'card.tx.today': 'Hoy',
  'card.tx.yesterday': 'Ayer',
  'card.tx.thisWeek': 'Esta semana',
  'card.tx.earlier': 'Antes',
  'card.tx.completed': 'Completada',
  'card.tx.pending': 'Pendiente',
  'card.tx.declined': 'Rechazada',

  'card.limits.title': 'Tus límites',
  'card.limits.dailySpending': 'Gasto diario',
  'card.limits.dailyAtm': 'Cajero diario',
  'card.limits.monthlySpending': 'Gasto mensual',
  'card.limits.monthlyTopup': 'Recarga mensual',
  'card.limits.remaining': '{{amount}} restante',
  'card.limits.resetNote': 'Los límites se restablecen diariamente a medianoche UTC / mensualmente el 1ro',
  'card.limits.upgradeFor': 'Sube a {{tier}} para mayores límites',

  'card.upgrade.unlockMore': 'Desbloquea más con {{tier}}',
  'card.upgrade.seeAllTiers': 'Ver todos los niveles',

  'card.physical.title': 'Obtén tu tarjeta física',
  'card.physical.description': 'Tarjeta AYNI Gold de {{material}}, envío mundial',
  'card.physical.cta': 'Solicitar tarjeta física',
  'card.physical.requested': 'Solicitada',
  'card.physical.formTitle': 'Dirección de envío',
  'card.physical.shippingInfo': '¿A dónde debemos enviar tu tarjeta?',
  'card.physical.fullName': 'Nombre completo',
  'card.physical.addressLine1': 'Dirección línea 1',
  'card.physical.addressLine2': 'Dirección línea 2',
  'card.physical.city': 'Ciudad',
  'card.physical.postalCode': 'Código postal',
  'card.physical.country': 'País',
  'card.physical.submit': 'Enviar solicitud',
  'card.physical.cancel': 'Cancelar',
  'card.physical.successTitle': 'Solicitud enviada',
  'card.physical.successDesc': 'Te notificaremos cuando tu tarjeta sea enviada.',
  'card.physical.orderTitle': 'Pedido de tarjeta física',
  'card.physical.orderConfirmed': 'Pedido confirmado',
  'card.physical.inProduction': 'En producción',
  'card.physical.shipped': 'Enviada',
  'card.physical.arrived': '¡Tu tarjeta ha llegado!',
  'card.physical.activateDesc': 'Actívala para empezar a usarla',
  'card.physical.activate': 'Activar tarjeta',
  'card.physical.active': 'Activa',
  'card.physical.cardLabel': 'Tarjeta física',

  'card.kyc.eligible.title': 'Puedes obtener la tarjeta Gold AYNI',
  'card.kyc.eligible.desc': 'Completa la verificación de identidad y recibe tu tarjeta Visa virtual al instante.',
  'card.kyc.eligible.cta': 'Iniciar verificación',
  'card.kyc.step.personal': 'Personal',
  'card.kyc.step.address': 'Dirección',
  'card.kyc.step.document': 'Documento',
  'card.kyc.step.review': 'Revisión',
  'card.kyc.back': 'Atrás',
  'card.kyc.continue': 'Continuar',
  'card.kyc.s1.title': 'Verifica tu identidad',
  'card.kyc.s1.desc': 'Necesitamos verificar tu identidad para emitir tu tarjeta Gold AYNI. Es un proceso único.',
  'card.kyc.s1.firstName': 'Nombre',
  'card.kyc.s1.lastName': 'Apellido',
  'card.kyc.s1.dob': 'Fecha de nacimiento',
  'card.kyc.s1.nationality': 'Nacionalidad',
  'card.kyc.s1.selectCountry': 'Seleccionar país',
  'card.kyc.s2.title': 'Tu dirección',
  'card.kyc.s2.desc': 'Para la entrega de la tarjeta y verificación',
  'card.kyc.s2.line1': 'Dirección línea 1',
  'card.kyc.s2.line2': 'Dirección línea 2',
  'card.kyc.s2.city': 'Ciudad',
  'card.kyc.s2.postal': 'Código postal',
  'card.kyc.s2.country': 'País',
  'card.kyc.s3.title': 'Verificación de identidad',
  'card.kyc.s3.passport': 'Pasaporte',
  'card.kyc.s3.idCard': 'Documento de identidad',
  'card.kyc.s3.driversLicense': 'Licencia de conducir',
  'card.kyc.s3.uploadDoc': 'Sube el frente de tu {{docType}}',
  'card.kyc.s3.uploadHint': 'JPG, PNG o PDF • Máx. 10MB',
  'card.kyc.s3.selfie': 'Toma una foto tuya sosteniendo tu documento',
  'card.kyc.s3.selfieHint': 'Selfie clara con documento visible',
  'card.kyc.s3.uploaded': 'Subido',
  'card.kyc.s4.title': 'Revisar y enviar',
  'card.kyc.s4.personalInfo': 'Información personal',
  'card.kyc.s4.address': 'Dirección',
  'card.kyc.s4.document': 'Documento',
  'card.kyc.s4.selfie': 'Selfie',
  'card.kyc.s4.edit': 'Editar',
  'card.kyc.s4.born': 'Nacido {{date}}',
  'card.kyc.s4.terms': 'Confirmo que la información es correcta y acepto los Términos de la tarjeta y la Política de privacidad',
  'card.kyc.s4.submit': 'Enviar verificación',
  'card.kyc.review.title': 'Verificando tu identidad',
  'card.kyc.review.desc': 'Generalmente toma 1–3 días hábiles. Te notificaremos cuando tu tarjeta esté lista.',
  'card.kyc.review.docsReceived': 'Documentos recibidos',
  'card.kyc.review.verifying': 'Verificación de identidad en progreso',
  'card.kyc.review.issuance': 'Emisión de tarjeta',
  'card.kyc.issuing.approved': '¡Tu verificación fue aprobada!',
  'card.kyc.issuing.generating': 'Emitiendo tu tarjeta Gold AYNI...',
  'card.kyc.issuing.generating.desc': 'Un momento mientras generamos los datos de tu tarjeta',
  'card.kyc.issuing.ready': '¡Tu tarjeta está lista!',
  'card.kyc.issuing.readyDesc': 'Tu tarjeta Visa virtual AYNI Gold está activa. Recarga con distribuciones PAXG y comienza a gastar.',
  'card.kyc.issuing.viewCard': 'Ver mi tarjeta',

  'card.blocked.title': 'Tarjeta bloqueada',
  'card.blocked.desc': 'Tu tarjeta ha sido bloqueada para revisión. Contacta a soporte.',
  'card.blocked.hint': 'Si crees que es un error, contacta a nuestro equipo de soporte.',

  'card.settings.title': 'Ajustes de tarjeta',
  'card.settings.back': 'Tarjeta Gold AYNI',
  'card.settings.contactless': 'Pagos sin contacto',
  'card.settings.online': 'Pagos en línea',
  'card.settings.atm': 'Retiros en cajero',
  'card.settings.notifications': 'Notificaciones de gastos',
  'card.settings.autoTopup': 'Recarga automática',
  'card.settings.autoTopupEnable': 'Activar recarga automática',
  'card.settings.autoTopupThreshold': 'Cuando el saldo baje de',
  'card.settings.autoTopupAmount': 'Convertir automáticamente',
  'card.settings.autoTopupSource': 'De tu saldo de distribuciones PAXG',
  'card.settings.yourLimits': 'Tus límites',
  'card.settings.tierLimits': 'Límites del nivel {{tier}}',
  'card.settings.compareTiers': 'Comparar todos los niveles',
  'card.settings.management': 'Gestión de tarjeta',
  'card.settings.replace': 'Reemplazar tarjeta',
  'card.settings.replaceDesc': '¿Perdida o robada? Bloquea y solicita un reemplazo.',
  'card.settings.replaceConfirm': 'Tu tarjeta actual será bloqueada y se emitirá una nueva. Esta acción es irreversible.',
  'card.settings.close': 'Cerrar cuenta de tarjeta',
  'card.settings.closeDesc': 'Cerrar tarjeta. El saldo restante se convierte a PAXG.',
  'card.settings.closeConfirm': 'Tu tarjeta se cerrará permanentemente y el saldo restante se convertirá a PAXG. Esta acción es irreversible.',

  'card.comparison.title': 'Tarjeta Gold AYNI por nivel',
  'card.comparison.yourTier': 'Tu nivel',
  'card.comparison.card': 'Tarjeta',
  'card.comparison.minAyni': 'Mín. AYNI',
  'card.comparison.minTerm': 'Plazo mín.',
  'card.comparison.monthlyLimit': 'Límite mensual',
  'card.comparison.dailyLimit': 'Límite diario',
  'card.comparison.atmDay': 'Cajero / día',
  'card.comparison.convFee': 'Comisión',
  'card.comparison.cashback': 'Cashback',
  'card.comparison.virtual': 'Virtual',
  'card.comparison.months': '{{n}} meses',
  'card.comparison.participate': 'Participa para subir de nivel',
  'card.comparison.virtualPhysical': 'Virtual + {{material}}',
  'card.comparison.goldPlated': 'Chapada en oro',
  'card.comparison.metal': 'Metal',
  'card.comparison.noCard': '—',
  'card.limits.upgradeDetails': '{{monthly}} mensual, {{daily}} diario',
  'card.limits.upgradeCashback': ', {{percent}}% cashback',
};
