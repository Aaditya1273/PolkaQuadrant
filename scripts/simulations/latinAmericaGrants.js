/**
 * LATAM Quadratic Funding Simulations
 * Realistic simulations of three major Latin American funding rounds
 * with AI fraud detection validation
 */

const fs = require('fs');
const path = require('path');

// Import AI fraud detector (adjust path as needed)
// const { fraudDetector } = require('../../backend/src/ai/fraudDetection');

/**
 * Simulation Configuration
 */
const SIMULATIONS = {
  buenosAires: {
    name: 'Buenos Aires Community Art Grant',
    location: 'Buenos Aires, Argentina',
    totalContributions: 100,
    projects: 12,
    matchingPool: 50000, // USD
    fraudRate: 0.12, // 12% fraud
  },
  mexicoCity: {
    name: 'Mexico City Tech Commons',
    location: 'Mexico City, Mexico',
    totalContributions: 150,
    projects: 18,
    matchingPool: 75000, // USD
    fraudRate: 0.15, // 15% fraud
  },
  saoPaulo: {
    name: 'São Paulo Social Impact Fund',
    location: 'São Paulo, Brazil',
    totalContributions: 200,
    projects: 24,
    matchingPool: 100000, // USD
    fraudRate: 0.10, // 10% fraud
  },
};

/**
 * Generate realistic contributor profile
 */
function generateContributor(id, region) {
  const walletAge = Math.random() < 0.7 
    ? Math.floor(Math.random() * 365 * 2) + 30 // 70% established wallets
    : Math.floor(Math.random() * 30); // 30% new wallets

  const transactionCount = walletAge > 180
    ? Math.floor(Math.random() * 100) + 20
    : Math.floor(Math.random() * 20);

  return {
    id: `${region}-contributor-${id}`,
    walletAddress: generateWalletAddress(),
    walletAge,
    transactionCount,
    previousContributions: Math.floor(Math.random() * 10),
    region,
    isVerified: Math.random() < 0.6, // 60% verified
  };
}

/**
 * Generate realistic contribution pattern
 */
function generateContribution(contributor, projectId, timestamp, isLegit = true) {
  let amount, frequency, velocity;

  if (isLegit) {
    // Legitimate contribution patterns
    amount = generateRealisticAmount();
    frequency = Math.random() < 0.8 ? 1 : Math.floor(Math.random() * 3) + 1;
    velocity = Math.random() * 0.3; // Low velocity
  } else {
    // Fraudulent patterns (will be varied by attack type)
    amount = generateFraudulentAmount();
    frequency = Math.floor(Math.random() * 10) + 5; // High frequency
    velocity = Math.random() * 0.5 + 0.5; // High velocity
  }

  return {
    contributorId: contributor.id,
    walletAddress: contributor.walletAddress,
    projectId,
    amount,
    timestamp,
    frequency,
    velocity,
    walletAge: contributor.walletAge,
    transactionCount: contributor.transactionCount,
    previousContributions: contributor.previousContributions,
    diversityScore: calculateDiversityScore(contributor),
    timingPattern: calculateTimingPattern(timestamp),
    isLegitimate: isLegit,
  };
}

/**
 * Generate Sybil attack contributions
 */
function generateSybilAttack(baseContributor, projectId, timestamp, attackSize = 5) {
  const sybilContributions = [];
  const baseAmount = 10 + Math.random() * 20; // Small amounts

  for (let i = 0; i < attackSize; i++) {
    const sybilContributor = {
      ...baseContributor,
      id: `${baseContributor.id}-sybil-${i}`,
      walletAddress: generateWalletAddress(),
      walletAge: Math.floor(Math.random() * 10), // Very new wallets
      transactionCount: Math.floor(Math.random() * 5), // Few transactions
      previousContributions: 0,
    };

    sybilContributions.push({
      ...generateContribution(sybilContributor, projectId, timestamp + i * 60, false),
      amount: baseAmount + (Math.random() * 5 - 2.5), // Similar amounts
      attackType: 'sybil',
      attackGroup: baseContributor.id,
    });
  }

  return sybilContributions;
}

/**
 * Generate wash trading attack
 */
function generateWashTrading(contributor, projectId, startTimestamp, rounds = 8) {
  const washContributions = [];
  const baseAmount = 50 + Math.random() * 50;

  for (let i = 0; i < rounds; i++) {
    washContributions.push({
      ...generateContribution(contributor, projectId, startTimestamp + i * 300, false),
      amount: baseAmount + (Math.random() * 10 - 5), // Consistent amounts
      frequency: rounds,
      velocity: 0.8 + Math.random() * 0.2, // Very high velocity
      attackType: 'washTrading',
      roundNumber: i + 1,
    });
  }

  return washContributions;
}

/**
 * Generate bot behavior attack
 */
function generateBotBehavior(contributor, projectId, startTimestamp, count = 10) {
  const botContributions = [];
  const exactAmount = 25; // Exact same amount
  const exactInterval = 600; // Exact 10-minute intervals

  for (let i = 0; i < count; i++) {
    botContributions.push({
      ...generateContribution(contributor, projectId, startTimestamp + i * exactInterval, false),
      amount: exactAmount,
      frequency: count,
      velocity: 0.9, // Very high velocity
      timingPattern: 1.0, // Perfect timing pattern
      attackType: 'bot',
      sequenceNumber: i + 1,
    });
  }

  return botContributions;
}

/**
 * Run simulation for a specific round
 */
function runSimulation(config) {
  console.log(`\n🎯 Running Simulation: ${config.name}`);
  console.log(`📍 Location: ${config.location}`);
  console.log(`💰 Matching Pool: $${config.matchingPool.toLocaleString()}`);
  console.log(`📊 Target Contributions: ${config.totalContributions}`);
  console.log(`⚠️  Fraud Rate: ${(config.fraudRate * 100).toFixed(1)}%\n`);

  const startTime = Date.now();
  const contributions = [];
  const projects = [];

  // Generate projects
  for (let i = 0; i < config.projects; i++) {
    projects.push({
      id: `project-${i + 1}`,
      name: generateProjectName(config.location),
      category: getRandomCategory(),
      fundingGoal: Math.floor(Math.random() * 10000) + 5000,
    });
  }

  // Calculate fraud distribution
  const fraudCount = Math.floor(config.totalContributions * config.fraudRate);
  const legitCount = config.totalContributions - fraudCount;

  console.log(`✅ Legitimate contributions: ${legitCount}`);
  console.log(`❌ Fraudulent contributions: ${fraudCount}\n`);

  // Generate legitimate contributions
  let timestamp = Date.now() - 86400000 * 30; // Start 30 days ago
  const region = config.location.split(',')[0].toLowerCase().replace(/\s+/g, '');

  for (let i = 0; i < legitCount; i++) {
    const contributor = generateContributor(i, region);
    const projectId = projects[Math.floor(Math.random() * projects.length)].id;
    timestamp += Math.floor(Math.random() * 3600000); // Random intervals

    contributions.push(generateContribution(contributor, projectId, timestamp, true));
  }

  // Generate fraudulent contributions (mix of attack types)
  const sybilCount = Math.floor(fraudCount * 0.4); // 40% Sybil
  const washCount = Math.floor(fraudCount * 0.35); // 35% Wash trading
  const botCount = fraudCount - sybilCount - washCount; // 25% Bot

  console.log(`🎭 Attack Distribution:`);
  console.log(`   Sybil Attacks: ${sybilCount}`);
  console.log(`   Wash Trading: ${washCount}`);
  console.log(`   Bot Behavior: ${botCount}\n`);

  // Generate Sybil attacks
  for (let i = 0; i < Math.ceil(sybilCount / 5); i++) {
    const attacker = generateContributor(legitCount + i, region);
    const projectId = projects[Math.floor(Math.random() * projects.length)].id;
    timestamp += Math.floor(Math.random() * 1800000);

    const sybilContribs = generateSybilAttack(attacker, projectId, timestamp, 5);
    contributions.push(...sybilContribs);
  }

  // Generate wash trading attacks
  for (let i = 0; i < Math.ceil(washCount / 8); i++) {
    const attacker = generateContributor(legitCount + sybilCount + i, region);
    const projectId = projects[Math.floor(Math.random() * projects.length)].id;
    timestamp += Math.floor(Math.random() * 3600000);

    const washContribs = generateWashTrading(attacker, projectId, timestamp, 8);
    contributions.push(...washContribs);
  }

  // Generate bot behavior attacks
  for (let i = 0; i < Math.ceil(botCount / 10); i++) {
    const attacker = generateContributor(legitCount + sybilCount + washCount + i, region);
    const projectId = projects[Math.floor(Math.random() * projects.length)].id;
    timestamp += Math.floor(Math.random() * 3600000);

    const botContribs = generateBotBehavior(attacker, projectId, timestamp, 10);
    contributions.push(...botContribs);
  }

  // Shuffle contributions to mix legitimate and fraudulent
  shuffleArray(contributions);

  console.log(`✅ Generated ${contributions.length} total contributions\n`);

  // Run AI detection
  console.log(`🤖 Running AI Fraud Detection...\n`);
  const detectionResults = analyzeContributions(contributions);

  // Calculate metrics
  const metrics = calculateMetrics(contributions, detectionResults);

  // Calculate funding distribution
  const fundingBefore = calculateQuadraticFunding(contributions, config.matchingPool);
  const fundingAfter = calculateQuadraticFunding(
    contributions.filter((c, i) => !detectionResults[i].isFraudulent),
    config.matchingPool
  );

  const processingTime = Date.now() - startTime;

  return {
    config,
    projects,
    contributions,
    detectionResults,
    metrics,
    fundingBefore,
    fundingAfter,
    processingTime,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analyze contributions with AI fraud detector
 */
function analyzeContributions(contributions) {
  const results = [];

  for (const contribution of contributions) {
    // Simulate AI analysis
    const features = extractFeatures(contribution);
    const prediction = predictFraud(features);

    results.push({
      contributionId: contribution.contributorId,
      isFraudulent: prediction.isFraudulent,
      riskScore: prediction.riskScore,
      confidence: prediction.confidence,
      explanation: prediction.explanation,
      actualLabel: !contribution.isLegitimate,
    });
  }

  return results;
}

/**
 * Extract features for AI model
 */
function extractFeatures(contribution) {
  return {
    amount: contribution.amount,
    frequency: contribution.frequency,
    velocity: contribution.velocity,
    walletAge: contribution.walletAge,
    transactionCount: contribution.transactionCount,
    previousContributions: contribution.previousContributions,
    diversityScore: contribution.diversityScore,
    timingPattern: contribution.timingPattern,
  };
}

/**
 * Predict fraud (simplified AI model simulation)
 */
function predictFraud(features) {
  // Simulate AI model prediction
  let riskScore = 0;

  // High frequency is suspicious
  if (features.frequency > 5) riskScore += 0.3;

  // High velocity is suspicious
  if (features.velocity > 0.6) riskScore += 0.25;

  // New wallet with many contributions is suspicious
  if (features.walletAge < 30 && features.frequency > 3) riskScore += 0.2;

  // Low diversity is suspicious
  if (features.diversityScore < 0.3) riskScore += 0.15;

  // Perfect timing pattern is suspicious
  if (features.timingPattern > 0.9) riskScore += 0.2;

  // Small amounts with high frequency (Sybil)
  if (features.amount < 30 && features.frequency > 5) riskScore += 0.15;

  // Add some randomness for realism
  riskScore += (Math.random() * 0.1 - 0.05);
  riskScore = Math.max(0, Math.min(1, riskScore));

  const isFraudulent = riskScore > 0.65;
  const confidence = Math.abs(riskScore - 0.65) / 0.35;

  let explanation = [];
  if (features.frequency > 5) explanation.push('High contribution frequency');
  if (features.velocity > 0.6) explanation.push('Rapid contribution velocity');
  if (features.walletAge < 30) explanation.push('New wallet');
  if (features.diversityScore < 0.3) explanation.push('Low diversity score');
  if (features.timingPattern > 0.9) explanation.push('Mechanical timing pattern');

  return {
    isFraudulent,
    riskScore,
    confidence,
    explanation: explanation.join(', ') || 'Normal contribution pattern',
  };
}

/**
 * Calculate detection metrics
 */
function calculateMetrics(contributions, detectionResults) {
  let truePositives = 0;
  let trueNegatives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  for (let i = 0; i < contributions.length; i++) {
    const actual = !contributions[i].isLegitimate;
    const predicted = detectionResults[i].isFraudulent;

    if (actual && predicted) truePositives++;
    else if (!actual && !predicted) trueNegatives++;
    else if (!actual && predicted) falsePositives++;
    else if (actual && !predicted) falseNegatives++;
  }

  const accuracy = (truePositives + trueNegatives) / contributions.length;
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
  const falsePositiveRate = falsePositives / (falsePositives + trueNegatives) || 0;
  const falseNegativeRate = falseNegatives / (falseNegatives + truePositives) || 0;

  return {
    totalContributions: contributions.length,
    actualFraud: contributions.filter(c => !c.isLegitimate).length,
    detectedFraud: detectionResults.filter(r => r.isFraudulent).length,
    truePositives,
    trueNegatives,
    falsePositives,
    falseNegatives,
    accuracy: (accuracy * 100).toFixed(2) + '%',
    precision: (precision * 100).toFixed(2) + '%',
    recall: (recall * 100).toFixed(2) + '%',
    f1Score: (f1Score * 100).toFixed(2) + '%',
    falsePositiveRate: (falsePositiveRate * 100).toFixed(2) + '%',
    falseNegativeRate: (falseNegativeRate * 100).toFixed(2) + '%',
  };
}

/**
 * Calculate quadratic funding distribution
 */
function calculateQuadraticFunding(contributions, matchingPool) {
  const projectContributions = {};

  // Group contributions by project
  for (const contrib of contributions) {
    if (!projectContributions[contrib.projectId]) {
      projectContributions[contrib.projectId] = [];
    }
    projectContributions[contrib.projectId].push(contrib);
  }

  // Calculate quadratic funding for each project
  const projectFunding = {};
  let totalQuadraticSum = 0;

  for (const [projectId, contribs] of Object.entries(projectContributions)) {
    const directFunding = contribs.reduce((sum, c) => sum + c.amount, 0);
    const sqrtSum = contribs.reduce((sum, c) => sum + Math.sqrt(c.amount), 0);
    const quadraticSum = Math.pow(sqrtSum, 2);

    projectFunding[projectId] = {
      directFunding,
      quadraticSum,
      contributorCount: contribs.length,
    };

    totalQuadraticSum += quadraticSum;
  }

  // Distribute matching pool proportionally
  for (const [projectId, funding] of Object.entries(projectFunding)) {
    const matchingFunds = (funding.quadraticSum / totalQuadraticSum) * matchingPool;
    funding.matchingFunds = matchingFunds;
    funding.totalFunding = funding.directFunding + matchingFunds;
  }

  return projectFunding;
}

/**
 * Helper functions
 */
function generateWalletAddress() {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = '5'; // Substrate address prefix
  for (let i = 0; i < 47; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
}

function generateRealisticAmount() {
  // Most contributions are small, few are large (power law distribution)
  const random = Math.random();
  if (random < 0.6) return Math.floor(Math.random() * 50) + 10; // 60%: $10-$60
  if (random < 0.85) return Math.floor(Math.random() * 150) + 50; // 25%: $50-$200
  if (random < 0.95) return Math.floor(Math.random() * 300) + 200; // 10%: $200-$500
  return Math.floor(Math.random() * 1000) + 500; // 5%: $500-$1500
}

function generateFraudulentAmount() {
  // Fraudulent contributions tend to be smaller and more uniform
  return Math.floor(Math.random() * 40) + 5; // $5-$45
}

function calculateDiversityScore(contributor) {
  // Higher score = more diverse contribution history
  return Math.min(1, contributor.previousContributions / 10 + Math.random() * 0.3);
}

function calculateTimingPattern(timestamp) {
  // 0 = random, 1 = perfectly mechanical
  return Math.random() * 0.4; // Most legitimate contributions are somewhat random
}

function generateProjectName(location) {
  const prefixes = ['Community', 'Local', 'Urban', 'Neighborhood', 'Grassroots'];
  const types = ['Art', 'Tech', 'Education', 'Health', 'Environment'];
  const suffixes = ['Initiative', 'Project', 'Collective', 'Hub', 'Network'];

  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
    types[Math.floor(Math.random() * types.length)]
  } ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function getRandomCategory() {
  const categories = ['Art & Culture', 'Technology', 'Education', 'Healthcare', 'Environment', 'Social Impact'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🌎 LATAM Quadratic Funding Simulations');
  console.log('=====================================\n');

  const results = {};

  // Run all simulations
  results.buenosAires = runSimulation(SIMULATIONS.buenosAires);
  results.mexicoCity = runSimulation(SIMULATIONS.mexicoCity);
  results.saoPaulo = runSimulation(SIMULATIONS.saoPaulo);

  // Generate summary report
  console.log('\n📊 SIMULATION SUMMARY');
  console.log('====================\n');

  for (const [key, result] of Object.entries(results)) {
    console.log(`${result.config.name}:`);
    console.log(`  Accuracy: ${result.metrics.accuracy}`);
    console.log(`  Precision: ${result.metrics.precision}`);
    console.log(`  Recall: ${result.metrics.recall}`);
    console.log(`  F1 Score: ${result.metrics.f1Score}`);
    console.log(`  False Positive Rate: ${result.metrics.falsePositiveRate}`);
    console.log(`  Processing Time: ${result.processingTime}ms\n`);
  }

  // Save results to JSON
  const outputDir = path.join(__dirname, 'results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(outputDir, `latam-simulation-${timestamp}.json`);

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

  console.log(`✅ Results saved to: ${outputFile}\n`);
  console.log('🎉 Simulation complete!\n');

  return results;
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  runSimulation,
  SIMULATIONS,
  generateContributor,
  generateContribution,
  generateSybilAttack,
  generateWashTrading,
  generateBotBehavior,
  analyzeContributions,
  calculateMetrics,
  calculateQuadraticFunding,
};
