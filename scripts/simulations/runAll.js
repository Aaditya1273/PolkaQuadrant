#!/usr/bin/env node

/**
 * Quick Run Script - Execute all simulations and analysis
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n🚀 PolkaQuadrant LATAM Simulations - Quick Run');
console.log('='.repeat(60));
console.log('');

// Check if we're in the right directory
const currentDir = process.cwd();
const expectedDir = path.join(__dirname);

if (currentDir !== expectedDir) {
  console.log(`📂 Changing directory to: ${expectedDir}\n`);
  process.chdir(expectedDir);
}

// Step 1: Run simulations
console.log('Step 1/2: Running simulations...\n');
console.log('-'.repeat(60));

try {
  execSync('node latinAmericaGrants.js', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Error running simulations:', error.message);
  process.exit(1);
}

console.log('\n' + '-'.repeat(60));
console.log('');

// Step 2: Analyze results
console.log('Step 2/2: Analyzing results...\n');
console.log('-'.repeat(60));

try {
  execSync('node analyzeResults.js', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Error analyzing results:', error.message);
  process.exit(1);
}

console.log('\n' + '-'.repeat(60));
console.log('');

// Summary
console.log('✅ All simulations and analysis complete!\n');

// List output files
const resultsDir = path.join(__dirname, 'results');
if (fs.existsSync(resultsDir)) {
  const files = fs.readdirSync(resultsDir)
    .filter(f => f.startsWith('latam-simulation-'))
    .sort()
    .reverse();

  if (files.length > 0) {
    console.log('📁 Output files:');
    const latest = files[0].replace('.json', '');
    console.log(`   - ${latest}.json`);
    console.log(`   - ${latest}.csv`);
    console.log(`   - ${latest}.md`);
    console.log('');
    console.log(`📂 Location: ${resultsDir}\n`);
  }
}

console.log('🎉 Done!\n');
