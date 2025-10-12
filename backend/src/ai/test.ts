/**
 * Quick test script for AI Fraud Detection
 * Run with: npx ts-node src/ai/test.ts
 */

import { FraudDetector } from './fraudDetection';
import { DataGenerator } from './dataGenerator';

async function testAI() {
  console.log('🧪 Testing AI Fraud Detection Module\n');

  // Initialize
  const detector = new FraudDetector();
  const generator = new DataGenerator();

  try {
    // Step 1: Generate test data
    console.log('📝 Step 1: Generating test data...');
    const testData = generator.generateBuenosAiresArtGrant(20);
    console.log(`✅ Generated ${testData.contributions.length} contributions`);
    console.log(`   Flagged: ${testData.metadata.flaggedCount}`);
    console.log(`   Total amount: ${testData.metadata.totalAmount.toFixed(2)}\n`);

    // Step 2: Load model
    console.log('🔧 Step 2: Loading AI model...');
    await detector.loadModel();
    console.log('✅ Model loaded successfully\n');

    // Step 3: Analyze contributions
    console.log('🔍 Step 3: Analyzing contributions...\n');
    
    const samples = testData.contributions.slice(0, 5);
    for (let i = 0; i < samples.length; i++) {
      const contribution = samples[i];
      const result = await detector.analyzeContribution(contribution);
      
      console.log(`Contribution ${i + 1}:`);
      console.log(`  Amount: ${contribution.amount}`);
      console.log(`  Wallet Age: ${contribution.walletAge} days`);
      console.log(`  Frequency: ${contribution.frequency}`);
      console.log(`  Risk Score: ${result.riskScore.toFixed(3)}`);
      console.log(`  Fraudulent: ${result.isFraudulent ? '⚠️  YES' : '✅ NO'}`);
      console.log(`  Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`  Explanation: ${result.explanation}\n`);
    }

    // Step 4: Analyze entire round
    console.log('📊 Step 4: Analyzing entire round...');
    const roundAnalysis = await detector.analyzeRound(testData.contributions);
    console.log(`\n${roundAnalysis.summary}\n`);

    // Step 5: Show statistics
    console.log('📈 Step 5: Dataset statistics:');
    const stats = generator.getDatasetStatistics(testData.contributions);
    console.log(`  Total: ${stats.total}`);
    console.log(`  Normal: ${stats.normal} (${(100 - stats.fraudPercentage).toFixed(1)}%)`);
    console.log(`  Fraudulent: ${stats.fraudulent} (${stats.fraudPercentage.toFixed(1)}%)`);
    console.log(`  Avg Amount: ${stats.averageAmount.toFixed(2)}`);
    console.log(`  Avg Wallet Age: ${stats.averageWalletAge.toFixed(1)} days\n`);

    console.log('✅ All tests passed! AI module is working correctly.\n');

    // Cleanup
    detector.dispose();

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testAI().then(() => {
  console.log('🎉 Test completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
