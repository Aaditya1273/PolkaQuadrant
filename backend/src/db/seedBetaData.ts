/**
 * Beta Testing Seed Data
 * Realistic mock data from 3 LATAM NGO testers
 */

export const betaTesters = [
  {
    testerId: 'tester_sofia_001',
    name: 'Sofia M.',
    email: 'sofia.martinez@buenosairesopengrants.org',
    organization: 'Buenos Aires Open Grants',
    country: 'Argentina',
    role: 'Program Director',
    joinedAt: '2024-01-15T10:00:00Z',
    status: 'active',
    metadata: {
      timezone: 'America/Argentina/Buenos_Aires',
      language: 'es',
      experience: 'advanced',
      focus: 'community-grants',
    },
  },
  {
    testerId: 'tester_carlos_002',
    name: 'Carlos J.',
    email: 'carlos.jimenez@mexicodao.network',
    organization: 'Mexico DAO Network',
    country: 'Mexico',
    role: 'Technical Lead',
    joinedAt: '2024-01-18T14:30:00Z',
    status: 'active',
    metadata: {
      timezone: 'America/Mexico_City',
      language: 'es',
      experience: 'expert',
      focus: 'blockchain-integration',
    },
  },
  {
    testerId: 'tester_lucia_003',
    name: 'Lúcia R.',
    email: 'lucia.rodrigues@saopaulocivicfund.org.br',
    organization: 'São Paulo Civic Fund',
    country: 'Brazil',
    role: 'Community Manager',
    joinedAt: '2024-01-20T09:15:00Z',
    status: 'active',
    metadata: {
      timezone: 'America/Sao_Paulo',
      language: 'pt',
      experience: 'intermediate',
      focus: 'social-impact',
    },
  },
];

export const betaFeedback = [
  // Sofia M. - Buenos Aires Open Grants
  {
    feedbackId: 'fb_sofia_001',
    testerId: 'tester_sofia_001',
    usabilityScore: 4.5,
    featureRatings: {
      'ai-fraud-detection': 5,
      'dashboard-ui': 4,
      'project-creation': 4.5,
      'contribution-flow': 4,
      'analytics': 5,
      'blockchain-integration': 4.5,
    },
    comments: 'La detección de fraude con IA es impresionante. Detectó patrones Sybil que nosotros habíamos pasado por alto en rondas anteriores. El dashboard es intuitivo, aunque sugiero agregar más opciones de filtrado por categorías. La integración con Polkadot es fluida y confiable.',
    category: 'feature-feedback',
    priority: 'high',
    status: 'reviewed',
    createdAt: '2024-01-22T15:30:00Z',
  },
  {
    feedbackId: 'fb_sofia_002',
    testerId: 'tester_sofia_001',
    usabilityScore: 4.8,
    featureRatings: {
      'quadratic-funding': 5,
      'matching-calculation': 5,
      'contributor-verification': 4.5,
    },
    comments: 'El cálculo de matching cuadrático es exacto y transparente. Los contribuyentes pueden ver en tiempo real cómo su aporte impacta el funding total. Esto genera mucha confianza en nuestra comunidad.',
    category: 'usability',
    priority: 'medium',
    status: 'new',
    createdAt: '2024-01-25T11:20:00Z',
  },
  {
    feedbackId: 'fb_sofia_003',
    testerId: 'tester_sofia_001',
    usabilityScore: 4.2,
    featureRatings: {
      'mobile-responsiveness': 3.5,
      'performance': 4.5,
      'documentation': 4,
    },
    comments: 'La versión móvil necesita mejoras. Algunos gráficos no se visualizan correctamente en pantallas pequeñas. Sin embargo, la velocidad de carga es excelente incluso con conexiones lentas.',
    category: 'bug-report',
    priority: 'medium',
    status: 'in-progress',
    createdAt: '2024-01-28T16:45:00Z',
  },

  // Carlos J. - Mexico DAO Network
  {
    feedbackId: 'fb_carlos_001',
    testerId: 'tester_carlos_002',
    usabilityScore: 4.7,
    featureRatings: {
      'blockchain-integration': 5,
      'smart-contract-interaction': 5,
      'wallet-connection': 4.5,
      'transaction-signing': 4.5,
      'network-switching': 4,
    },
    comments: 'Excellent blockchain integration! The Polkadot.js API implementation is solid. Connection pooling works great, and auto-reconnection saved us during network hiccups. Would love to see support for more parachains like Moonbeam.',
    category: 'technical-feedback',
    priority: 'high',
    status: 'reviewed',
    createdAt: '2024-01-23T10:15:00Z',
  },
  {
    feedbackId: 'fb_carlos_002',
    testerId: 'tester_carlos_002',
    usabilityScore: 4.9,
    featureRatings: {
      'api-performance': 5,
      'real-time-updates': 5,
      'websocket-stability': 4.5,
      'error-handling': 5,
    },
    comments: 'API performance is outstanding. Real-time event monitoring works flawlessly. The error handling is comprehensive - every edge case seems covered. WebSocket connections are stable even during high load.',
    category: 'performance',
    priority: 'high',
    status: 'reviewed',
    createdAt: '2024-01-26T14:00:00Z',
  },
  {
    feedbackId: 'fb_carlos_003',
    testerId: 'tester_carlos_002',
    usabilityScore: 4.3,
    featureRatings: {
      'developer-docs': 4,
      'api-documentation': 4.5,
      'code-examples': 4,
    },
    comments: 'Documentation is good but could use more code examples for advanced use cases. The API reference is comprehensive. Would appreciate a Postman collection for easier testing.',
    category: 'documentation',
    priority: 'low',
    status: 'new',
    createdAt: '2024-01-29T09:30:00Z',
  },

  // Lúcia R. - São Paulo Civic Fund
  {
    feedbackId: 'fb_lucia_001',
    testerId: 'tester_lucia_003',
    usabilityScore: 4.6,
    featureRatings: {
      'user-interface': 5,
      'onboarding': 4.5,
      'help-system': 4,
      'accessibility': 4.5,
    },
    comments: 'A interface é linda e muito fácil de usar! O processo de onboarding guiou nossa equipe perfeitamente. Conseguimos criar nossa primeira rodada de financiamento em menos de 10 minutos. Parabéns!',
    category: 'usability',
    priority: 'medium',
    status: 'reviewed',
    createdAt: '2024-01-24T13:45:00Z',
  },
  {
    feedbackId: 'fb_lucia_002',
    testerId: 'tester_lucia_003',
    usabilityScore: 4.8,
    featureRatings: {
      'fraud-detection-ui': 5,
      'alerts-notifications': 5,
      'reporting': 4.5,
      'data-visualization': 5,
    },
    comments: 'O sistema de detecção de fraude é incrível! Os alertas em tempo real nos permitiram agir rapidamente. Os gráficos e visualizações tornam os dados complexos muito fáceis de entender. Nossa comunidade adora a transparência.',
    category: 'feature-feedback',
    priority: 'high',
    status: 'reviewed',
    createdAt: '2024-01-27T10:00:00Z',
  },
  {
    feedbackId: 'fb_lucia_003',
    testerId: 'tester_lucia_003',
    usabilityScore: 4.4,
    featureRatings: {
      'multilingual-support': 3.5,
      'localization': 4,
      'currency-display': 4.5,
    },
    comments: 'Seria ótimo ter suporte completo para português brasileiro. Algumas partes ainda estão em inglês. A exibição de valores em Real (BRL) funcionou bem, mas precisamos de mais opções de moedas locais.',
    category: 'feature-request',
    priority: 'medium',
    status: 'new',
    createdAt: '2024-01-30T15:20:00Z',
  },
];

export const userMetrics = [
  // Sofia M. metrics
  ...generateMetrics('tester_sofia_001', 'session_sofia_001', [
    { action: 'page_view', feature: 'dashboard', duration: 45000 },
    { action: 'create_project', feature: 'project-creation', duration: 180000 },
    { action: 'view_analytics', feature: 'analytics', duration: 120000 },
    { action: 'export_data', feature: 'data-export', duration: 15000 },
    { action: 'configure_round', feature: 'funding-rounds', duration: 240000 },
  ]),
  ...generateMetrics('tester_sofia_001', 'session_sofia_002', [
    { action: 'review_contributions', feature: 'contributions', duration: 90000 },
    { action: 'check_fraud_alerts', feature: 'fraud-detection', duration: 60000 },
    { action: 'update_project', feature: 'project-management', duration: 150000 },
  ]),

  // Carlos J. metrics
  ...generateMetrics('tester_carlos_002', 'session_carlos_001', [
    { action: 'test_api', feature: 'api-testing', duration: 300000 },
    { action: 'blockchain_query', feature: 'blockchain-integration', duration: 45000 },
    { action: 'wallet_connect', feature: 'wallet-connection', duration: 30000 },
    { action: 'sign_transaction', feature: 'transaction-signing', duration: 60000 },
    { action: 'monitor_events', feature: 'event-monitoring', duration: 180000 },
  ]),
  ...generateMetrics('tester_carlos_002', 'session_carlos_002', [
    { action: 'performance_test', feature: 'performance-testing', duration: 420000 },
    { action: 'load_test', feature: 'load-testing', duration: 600000 },
    { action: 'review_logs', feature: 'logging', duration: 90000 },
  ]),

  // Lúcia R. metrics
  ...generateMetrics('tester_lucia_003', 'session_lucia_001', [
    { action: 'onboarding', feature: 'onboarding', duration: 600000 },
    { action: 'create_project', feature: 'project-creation', duration: 150000 },
    { action: 'invite_contributors', feature: 'user-management', duration: 120000 },
    { action: 'view_dashboard', feature: 'dashboard', duration: 180000 },
  ]),
  ...generateMetrics('tester_lucia_003', 'session_lucia_002', [
    { action: 'check_analytics', feature: 'analytics', duration: 240000 },
    { action: 'generate_report', feature: 'reporting', duration: 180000 },
    { action: 'share_results', feature: 'sharing', duration: 60000 },
  ]),
];

export const surveyResponses = [
  {
    responseId: 'survey_sofia_001',
    testerId: 'tester_sofia_001',
    surveyId: 'beta_survey_v1',
    responses: {
      q1_overall_satisfaction: 5,
      q2_ease_of_use: 4,
      q3_feature_completeness: 4,
      q4_performance: 5,
      q5_would_recommend: 5,
      q6_most_valuable_feature: 'AI fraud detection - it\'s a game changer',
      q7_improvement_suggestions: 'Better mobile support and more filtering options',
      q8_missing_features: 'Multi-language support, especially Spanish',
      q9_technical_issues: 'Minor UI glitches on mobile devices',
      q10_additional_comments: 'This platform has huge potential for LATAM communities',
    },
    completedAt: '2024-01-30T16:00:00Z',
  },
  {
    responseId: 'survey_carlos_001',
    testerId: 'tester_carlos_002',
    surveyId: 'beta_survey_v1',
    responses: {
      q1_overall_satisfaction: 5,
      q2_ease_of_use: 5,
      q3_feature_completeness: 4,
      q4_performance: 5,
      q5_would_recommend: 5,
      q6_most_valuable_feature: 'Blockchain integration and real-time event monitoring',
      q7_improvement_suggestions: 'More parachain support, better API documentation',
      q8_missing_features: 'GraphQL API, Postman collection, SDK for common languages',
      q9_technical_issues: 'None - very stable',
      q10_additional_comments: 'Excellent technical implementation. Ready for production.',
    },
    completedAt: '2024-01-30T17:30:00Z',
  },
  {
    responseId: 'survey_lucia_001',
    testerId: 'tester_lucia_003',
    surveyId: 'beta_survey_v1',
    responses: {
      q1_overall_satisfaction: 5,
      q2_ease_of_use: 5,
      q3_feature_completeness: 4,
      q4_performance: 5,
      q5_would_recommend: 5,
      q6_most_valuable_feature: 'Beautiful UI and transparent fraud detection',
      q7_improvement_suggestions: 'Portuguese language support, more currency options',
      q8_missing_features: 'Community forums, in-app chat support',
      q9_technical_issues: 'Some translations missing',
      q10_additional_comments: 'Our community loves it! Can\'t wait for the full release.',
    },
    completedAt: '2024-01-30T18:45:00Z',
  },
];

// Helper function to generate metrics
function generateMetrics(testerId: string, sessionId: string, actions: any[]) {
  return actions.map((action, index) => ({
    metricId: `metric_${testerId}_${sessionId}_${index}`,
    testerId,
    sessionId,
    action: action.action,
    feature: action.feature,
    duration: action.duration,
    metadata: {
      browser: 'Chrome',
      os: 'Windows 10',
      screenResolution: '1920x1080',
    },
    timestamp: new Date(Date.now() - (actions.length - index) * 3600000).toISOString(),
  }));
}

// Initialize data function
export function initializeBetaData() {
  return {
    testers: betaTesters,
    feedback: betaFeedback,
    metrics: userMetrics,
    surveys: surveyResponses,
  };
}

export default {
  betaTesters,
  betaFeedback,
  userMetrics,
  surveyResponses,
  initializeBetaData,
};
