/**
 * LATAM Simulation Results Analyzer
 * Comprehensive analysis and visualization of simulation results
 */

const fs = require('fs');
const path = require('path');

/**
 * Analyze simulation results
 */
function analyzeResults(results) {
  console.log('\n📊 DETAILED ANALYSIS REPORT');
  console.log('===========================\n');

  const allSimulations = Object.values(results);
  
  // Overall statistics
  const overallStats = calculateOverallStats(allSimulations);
  printOverallStats(overallStats);

  // Individual simulation analysis
  for (const [key, result] of Object.entries(results)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${result.config.name.toUpperCase()}`);
    console.log(`${'='.repeat(60)}\n`);

    analyzeSimulation(result);
  }

  // Comparative analysis
  console.log(`\n${'='.repeat(60)}`);
  console.log('COMPARATIVE ANALYSIS');
  console.log(`${'='.repeat(60)}\n`);
  
  compareSimulations(allSimulations);

  // Funding fairness analysis
  console.log(`\n${'='.repeat(60)}`);
  console.log('FUNDING FAIRNESS IMPROVEMENT');
  console.log(`${'='.repeat(60)}\n`);
  
  analyzeFundingFairness(allSimulations);

  return {
    overallStats,
    individualAnalysis: allSimulations.map(s => analyzeSimulation(s, true)),
    comparativeAnalysis: compareSimulations(allSimulations, true),
    fundingAnalysis: analyzeFundingFairness(allSimulations, true),
  };
}

/**
 * Calculate overall statistics
 */
function calculateOverallStats(simulations) {
  const totalContributions = simulations.reduce((sum, s) => sum + s.contributions.length, 0);
  const totalFraud = simulations.reduce((sum, s) => s.metrics.actualFraud, 0);
  const totalDetected = simulations.reduce((sum, s) => s.metrics.detectedFraud, 0);
  const totalTP = simulations.reduce((sum, s) => s.metrics.truePositives, 0);
  const totalTN = simulations.reduce((sum, s) => s.metrics.trueNegatives, 0);
  const totalFP = simulations.reduce((sum, s) => s.metrics.falsePositives, 0);
  const totalFN = simulations.reduce((sum, s) => s.metrics.falseNegatives, 0);

  const avgAccuracy = simulations.reduce((sum, s) => sum + parseFloat(s.metrics.accuracy), 0) / simulations.length;
  const avgPrecision = simulations.reduce((sum, s) => sum + parseFloat(s.metrics.precision), 0) / simulations.length;
  const avgRecall = simulations.reduce((sum, s) => sum + parseFloat(s.metrics.recall), 0) / simulations.length;
  const avgF1 = simulations.reduce((sum, s) => sum + parseFloat(s.metrics.f1Score), 0) / simulations.length;

  return {
    totalContributions,
    totalFraud,
    totalDetected,
    fraudRate: (totalFraud / totalContributions * 100).toFixed(2) + '%',
    detectionRate: (totalDetected / totalFraud * 100).toFixed(2) + '%',
    truePositives: totalTP,
    trueNegatives: totalTN,
    falsePositives: totalFP,
    falseNegatives: totalFN,
    avgAccuracy: avgAccuracy.toFixed(2) + '%',
    avgPrecision: avgPrecision.toFixed(2) + '%',
    avgRecall: avgRecall.toFixed(2) + '%',
    avgF1Score: avgF1.toFixed(2) + '%',
  };
}

/**
 * Print overall statistics
 */
function printOverallStats(stats) {
  console.log('Overall Statistics Across All Simulations:');
  console.log(`  Total Contributions: ${stats.totalContributions}`);
  console.log(`  Total Fraud: ${stats.totalFraud} (${stats.fraudRate})`);
  console.log(`  Total Detected: ${stats.totalDetected} (${stats.detectionRate})`);
  console.log(`\nConfusion Matrix (Aggregated):`);
  console.log(`  True Positives:  ${stats.truePositives}`);
  console.log(`  True Negatives:  ${stats.trueNegatives}`);
  console.log(`  False Positives: ${stats.falsePositives}`);
  console.log(`  False Negatives: ${stats.falseNegatives}`);
  console.log(`\nAverage Performance Metrics:`);
  console.log(`  Accuracy:  ${stats.avgAccuracy}`);
  console.log(`  Precision: ${stats.avgPrecision}`);
  console.log(`  Recall:    ${stats.avgRecall}`);
  console.log(`  F1 Score:  ${stats.avgF1Score}`);
}

/**
 * Analyze individual simulation
 */
function analyzeSimulation(result, returnOnly = false) {
  const analysis = {
    name: result.config.name,
    location: result.config.location,
    
    // Contribution statistics
    contributionStats: {
      total: result.contributions.length,
      legitimate: result.contributions.filter(c => c.isLegitimate).length,
      fraudulent: result.contributions.filter(c => !c.isLegitimate).length,
      fraudRate: ((result.contributions.filter(c => !c.isLegitimate).length / result.contributions.length) * 100).toFixed(2) + '%',
    },

    // Attack breakdown
    attackBreakdown: {
      sybil: result.contributions.filter(c => c.attackType === 'sybil').length,
      washTrading: result.contributions.filter(c => c.attackType === 'washTrading').length,
      bot: result.contributions.filter(c => c.attackType === 'bot').length,
    },

    // Detection performance
    detectionPerformance: result.metrics,

    // Funding impact
    fundingImpact: analyzeFundingImpact(result),

    // Processing performance
    performance: {
      processingTime: result.processingTime + 'ms',
      contributionsPerSecond: Math.round(result.contributions.length / (result.processingTime / 1000)),
    },
  };

  if (!returnOnly) {
    console.log('Contribution Statistics:');
    console.log(`  Total: ${analysis.contributionStats.total}`);
    console.log(`  Legitimate: ${analysis.contributionStats.legitimate}`);
    console.log(`  Fraudulent: ${analysis.contributionStats.fraudulent} (${analysis.contributionStats.fraudRate})`);

    console.log('\nAttack Type Breakdown:');
    console.log(`  Sybil Attacks: ${analysis.attackBreakdown.sybil}`);
    console.log(`  Wash Trading: ${analysis.attackBreakdown.washTrading}`);
    console.log(`  Bot Behavior: ${analysis.attackBreakdown.bot}`);

    console.log('\nDetection Performance:');
    console.log(`  Accuracy:  ${analysis.detectionPerformance.accuracy}`);
    console.log(`  Precision: ${analysis.detectionPerformance.precision}`);
    console.log(`  Recall:    ${analysis.detectionPerformance.recall}`);
    console.log(`  F1 Score:  ${analysis.detectionPerformance.f1Score}`);
    console.log(`  False Positive Rate: ${analysis.detectionPerformance.falsePositiveRate}`);
    console.log(`  False Negative Rate: ${analysis.detectionPerformance.falseNegativeRate}`);

    console.log('\nFunding Impact:');
    console.log(`  Projects Affected by Fraud: ${analysis.fundingImpact.projectsAffected}`);
    console.log(`  Total Funding Before: $${analysis.fundingImpact.totalBefore.toLocaleString()}`);
    console.log(`  Total Funding After: $${analysis.fundingImpact.totalAfter.toLocaleString()}`);
    console.log(`  Funding Redistribution: $${analysis.fundingImpact.redistribution.toLocaleString()}`);
    console.log(`  Fairness Improvement: ${analysis.fundingImpact.fairnessImprovement}`);

    console.log('\nProcessing Performance:');
    console.log(`  Processing Time: ${analysis.performance.processingTime}`);
    console.log(`  Throughput: ${analysis.performance.contributionsPerSecond} contributions/second`);
  }

  return analysis;
}

/**
 * Analyze funding impact
 */
function analyzeFundingImpact(result) {
  const projectsBefore = Object.keys(result.fundingBefore);
  const projectsAfter = Object.keys(result.fundingAfter);

  let totalBefore = 0;
  let totalAfter = 0;
  let projectsAffected = 0;

  for (const projectId of projectsBefore) {
    const before = result.fundingBefore[projectId].totalFunding;
    const after = result.fundingAfter[projectId]?.totalFunding || 0;

    totalBefore += before;
    totalAfter += after;

    if (Math.abs(before - after) > 0.01) {
      projectsAffected++;
    }
  }

  const redistribution = Math.abs(totalBefore - totalAfter);
  const fairnessImprovement = ((redistribution / totalBefore) * 100).toFixed(2) + '%';

  return {
    projectsAffected,
    totalBefore,
    totalAfter,
    redistribution,
    fairnessImprovement,
  };
}

/**
 * Compare simulations
 */
function compareSimulations(simulations, returnOnly = false) {
  const comparison = {
    byAccuracy: [...simulations].sort((a, b) => 
      parseFloat(b.metrics.accuracy) - parseFloat(a.metrics.accuracy)
    ),
    byFraudRate: [...simulations].sort((a, b) => 
      b.config.fraudRate - a.config.fraudRate
    ),
    byProcessingTime: [...simulations].sort((a, b) => 
      a.processingTime - b.processingTime
    ),
  };

  if (!returnOnly) {
    console.log('Ranking by Detection Accuracy:');
    comparison.byAccuracy.forEach((sim, i) => {
      console.log(`  ${i + 1}. ${sim.config.name}: ${sim.metrics.accuracy}`);
    });

    console.log('\nRanking by Fraud Rate (Highest to Lowest):');
    comparison.byFraudRate.forEach((sim, i) => {
      console.log(`  ${i + 1}. ${sim.config.name}: ${(sim.config.fraudRate * 100).toFixed(1)}%`);
    });

    console.log('\nRanking by Processing Speed (Fastest to Slowest):');
    comparison.byProcessingTime.forEach((sim, i) => {
      const throughput = Math.round(sim.contributions.length / (sim.processingTime / 1000));
      console.log(`  ${i + 1}. ${sim.config.name}: ${sim.processingTime}ms (${throughput} contrib/s)`);
    });
  }

  return comparison;
}

/**
 * Analyze funding fairness
 */
function analyzeFundingFairness(simulations, returnOnly = false) {
  const fairnessAnalysis = simulations.map(sim => {
    const projectChanges = [];

    for (const projectId of Object.keys(sim.fundingBefore)) {
      const before = sim.fundingBefore[projectId];
      const after = sim.fundingAfter[projectId];

      if (after) {
        const change = after.totalFunding - before.totalFunding;
        const changePercent = (change / before.totalFunding * 100).toFixed(2);

        projectChanges.push({
          projectId,
          fundingBefore: before.totalFunding,
          fundingAfter: after.totalFunding,
          change,
          changePercent: changePercent + '%',
          contributorsBefore: before.contributorCount,
          contributorsAfter: after.contributorCount,
        });
      }
    }

    // Sort by absolute change
    projectChanges.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

    return {
      name: sim.config.name,
      projectChanges,
      topGainers: projectChanges.filter(p => p.change > 0).slice(0, 3),
      topLosers: projectChanges.filter(p => p.change < 0).slice(0, 3),
    };
  });

  if (!returnOnly) {
    fairnessAnalysis.forEach(analysis => {
      console.log(`\n${analysis.name}:`);
      
      console.log('\n  Top 3 Projects Gaining Funding (fraud removed):');
      analysis.topGainers.forEach((project, i) => {
        console.log(`    ${i + 1}. ${project.projectId}: +$${project.change.toFixed(2)} (${project.changePercent})`);
      });

      console.log('\n  Top 3 Projects Losing Funding (fraud detected):');
      analysis.topLosers.forEach((project, i) => {
        console.log(`    ${i + 1}. ${project.projectId}: -$${Math.abs(project.change).toFixed(2)} (${project.changePercent})`);
      });
    });
  }

  return fairnessAnalysis;
}

/**
 * Generate CSV export
 */
function exportToCSV(results, outputPath) {
  const rows = [];
  
  // Header
  rows.push([
    'Simulation',
    'Location',
    'Total Contributions',
    'Fraud Count',
    'Fraud Rate',
    'Accuracy',
    'Precision',
    'Recall',
    'F1 Score',
    'False Positive Rate',
    'False Negative Rate',
    'Processing Time (ms)',
    'Throughput (contrib/s)',
  ].join(','));

  // Data rows
  for (const [key, result] of Object.entries(results)) {
    const throughput = Math.round(result.contributions.length / (result.processingTime / 1000));
    
    rows.push([
      result.config.name,
      result.config.location,
      result.contributions.length,
      result.metrics.actualFraud,
      (result.metrics.actualFraud / result.contributions.length * 100).toFixed(2) + '%',
      result.metrics.accuracy,
      result.metrics.precision,
      result.metrics.recall,
      result.metrics.f1Score,
      result.metrics.falsePositiveRate,
      result.metrics.falseNegativeRate,
      result.processingTime,
      throughput,
    ].join(','));
  }

  fs.writeFileSync(outputPath, rows.join('\n'));
  console.log(`\n✅ CSV exported to: ${outputPath}`);
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results, analysis, outputPath) {
  const lines = [];

  lines.push('# LATAM Quadratic Funding Simulation Results\n');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');

  // Executive Summary
  lines.push('## Executive Summary\n');
  lines.push(`- **Total Contributions Analyzed:** ${analysis.overallStats.totalContributions}`);
  lines.push(`- **Total Fraud Detected:** ${analysis.overallStats.totalFraud} (${analysis.overallStats.fraudRate})`);
  lines.push(`- **Average Detection Accuracy:** ${analysis.overallStats.avgAccuracy}`);
  lines.push(`- **Average F1 Score:** ${analysis.overallStats.avgF1Score}\n`);

  // Individual Simulations
  lines.push('## Individual Simulation Results\n');

  for (const [key, result] of Object.entries(results)) {
    lines.push(`### ${result.config.name}\n`);
    lines.push(`**Location:** ${result.config.location}  `);
    lines.push(`**Matching Pool:** $${result.config.matchingPool.toLocaleString()}\n`);

    lines.push('#### Detection Metrics\n');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Accuracy | ${result.metrics.accuracy} |`);
    lines.push(`| Precision | ${result.metrics.precision} |`);
    lines.push(`| Recall | ${result.metrics.recall} |`);
    lines.push(`| F1 Score | ${result.metrics.f1Score} |`);
    lines.push(`| False Positive Rate | ${result.metrics.falsePositiveRate} |`);
    lines.push(`| False Negative Rate | ${result.metrics.falseNegativeRate} |\n`);

    lines.push('#### Confusion Matrix\n');
    lines.push('| | Predicted Fraud | Predicted Legitimate |');
    lines.push('|---|---|---|');
    lines.push(`| **Actual Fraud** | ${result.metrics.truePositives} | ${result.metrics.falseNegatives} |`);
    lines.push(`| **Actual Legitimate** | ${result.metrics.falsePositives} | ${result.metrics.trueNegatives} |\n`);
  }

  // Performance Comparison
  lines.push('## Performance Comparison\n');
  lines.push('| Simulation | Accuracy | Precision | Recall | F1 Score | Processing Time |');
  lines.push('|------------|----------|-----------|--------|----------|-----------------|');

  for (const [key, result] of Object.entries(results)) {
    const throughput = Math.round(result.contributions.length / (result.processingTime / 1000));
    lines.push(`| ${result.config.name} | ${result.metrics.accuracy} | ${result.metrics.precision} | ${result.metrics.recall} | ${result.metrics.f1Score} | ${result.processingTime}ms (${throughput}/s) |`);
  }

  lines.push('');

  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log(`✅ Markdown report generated: ${outputPath}`);
}

/**
 * Main analysis function
 */
function main() {
  const resultsDir = path.join(__dirname, 'results');
  
  // Find the most recent results file
  const files = fs.readdirSync(resultsDir)
    .filter(f => f.startsWith('latam-simulation-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌ No simulation results found. Run latinAmericaGrants.js first.');
    process.exit(1);
  }

  const latestFile = path.join(resultsDir, files[0]);
  console.log(`📂 Loading results from: ${latestFile}\n`);

  const results = JSON.parse(fs.readFileSync(latestFile, 'utf8'));

  // Analyze results
  const analysis = analyzeResults(results);

  // Export to CSV
  const csvPath = latestFile.replace('.json', '.csv');
  exportToCSV(results, csvPath);

  // Generate markdown report
  const mdPath = latestFile.replace('.json', '.md');
  generateMarkdownReport(results, analysis, mdPath);

  console.log('\n✅ Analysis complete!\n');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeResults,
  calculateOverallStats,
  analyzeSimulation,
  compareSimulations,
  analyzeFundingFairness,
  exportToCSV,
  generateMarkdownReport,
};
