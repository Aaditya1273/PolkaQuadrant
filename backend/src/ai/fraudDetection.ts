import * as tf from '@tensorflow/tfjs-node';
import { ContributionData, FraudDetectionResult, RiskFactors } from '../types/ai';

/**
 * AI-Powered Fraud Detection Engine for Quadratic Funding
 * Uses TensorFlow.js for anomaly detection in contribution patterns
 */
export class FraudDetector {
  private model: tf.LayersModel | null = null;
  private threshold: number;
  private isModelLoaded: boolean = false;

  constructor(threshold: number = 0.7) {
    this.threshold = threshold;
  }

  /**
   * Initialize and load the trained model
   */
  async loadModel(modelPath?: string): Promise<void> {
    try {
      if (modelPath) {
        this.model = await tf.loadLayersModel(`file://${modelPath}`);
      } else {
        // Create a new model if no saved model exists
        this.model = this.createModel();
      }
      this.isModelLoaded = true;
      console.log('✅ Fraud detection model loaded successfully');
    } catch (error) {
      console.error('❌ Error loading model:', error);
      throw error;
    }
  }

  /**
   * Create the neural network architecture for anomaly detection
   * Uses an autoencoder approach for unsupervised learning
   */
  private createModel(): tf.LayersModel {
    const inputDim = 8; // Number of features

    // Encoder
    const input = tf.input({ shape: [inputDim] });
    const encoded = tf.layers.dense({
      units: 6,
      activation: 'relu',
      kernelInitializer: 'heNormal',
    }).apply(input) as tf.SymbolicTensor;

    const encoded2 = tf.layers.dense({
      units: 4,
      activation: 'relu',
      kernelInitializer: 'heNormal',
    }).apply(encoded) as tf.SymbolicTensor;

    // Bottleneck
    const bottleneck = tf.layers.dense({
      units: 2,
      activation: 'relu',
      kernelInitializer: 'heNormal',
      name: 'bottleneck',
    }).apply(encoded2) as tf.SymbolicTensor;

    // Decoder
    const decoded = tf.layers.dense({
      units: 4,
      activation: 'relu',
      kernelInitializer: 'heNormal',
    }).apply(bottleneck) as tf.SymbolicTensor;

    const decoded2 = tf.layers.dense({
      units: 6,
      activation: 'relu',
      kernelInitializer: 'heNormal',
    }).apply(decoded) as tf.SymbolicTensor;

    const output = tf.layers.dense({
      units: inputDim,
      activation: 'sigmoid',
    }).apply(decoded2) as tf.SymbolicTensor;

    const model = tf.model({ inputs: input, outputs: output });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae'],
    });

    return model;
  }

  /**
   * Preprocess contribution data into feature vector
   */
  private preprocessContribution(contribution: ContributionData): number[] {
    const {
      amount,
      frequency,
      walletAge,
      transactionCount,
      averageAmount,
      timeVariance,
      uniqueProjects,
      roundParticipation,
    } = contribution;

    // Normalize features to 0-1 range
    return [
      this.normalize(amount, 0, 100000), // Contribution amount
      this.normalize(frequency, 0, 100), // Contribution frequency
      this.normalize(walletAge, 0, 365), // Wallet age in days
      this.normalize(transactionCount, 0, 1000), // Total transactions
      this.normalize(averageAmount, 0, 50000), // Average contribution
      this.normalize(timeVariance, 0, 1), // Time pattern variance
      this.normalize(uniqueProjects, 0, 50), // Number of unique projects
      this.normalize(roundParticipation, 0, 10), // Rounds participated
    ];
  }

  /**
   * Normalize value to 0-1 range
   */
  private normalize(value: number, min: number, max: number): number {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  /**
   * Calculate reconstruction error for anomaly detection
   */
  private async calculateReconstructionError(
    input: tf.Tensor,
    output: tf.Tensor
  ): Promise<number> {
    const error = tf.metrics.meanSquaredError(input, output);
    const errorValue = await error.data();
    error.dispose();
    return errorValue[0];
  }

  /**
   * Analyze a single contribution for fraud
   */
  async analyzeContribution(
    contribution: ContributionData
  ): Promise<FraudDetectionResult> {
    if (!this.isModelLoaded || !this.model) {
      throw new Error('Model not loaded. Call loadModel() first.');
    }

    const features = this.preprocessContribution(contribution);
    const inputTensor = tf.tensor2d([features]);

    try {
      // Get model prediction
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const reconstructionError = await this.calculateReconstructionError(
        inputTensor,
        prediction
      );

      // Calculate risk score (higher error = higher risk)
      const riskScore = Math.min(1, reconstructionError * 10);

      // Analyze risk factors
      const riskFactors = this.analyzeRiskFactors(contribution, riskScore);

      // Determine if fraudulent
      const isFraudulent = riskScore > this.threshold;

      // Generate explanation
      const explanation = this.generateExplanation(
        riskScore,
        riskFactors,
        contribution
      );

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      return {
        riskScore,
        isFraudulent,
        confidence: this.calculateConfidence(riskScore),
        riskFactors,
        explanation,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      inputTensor.dispose();
      throw error;
    }
  }

  /**
   * Analyze specific risk factors
   */
  private analyzeRiskFactors(
    contribution: ContributionData,
    riskScore: number
  ): RiskFactors {
    return {
      sybilAttack: this.detectSybilPattern(contribution),
      washTrading: this.detectWashTrading(contribution),
      unusualAmount: this.detectUnusualAmount(contribution),
      suspiciousTiming: this.detectSuspiciousTiming(contribution),
      newWallet: contribution.walletAge < 7, // Less than 7 days old
      lowDiversity: contribution.uniqueProjects < 2,
    };
  }

  /**
   * Detect Sybil attack patterns
   */
  private detectSybilPattern(contribution: ContributionData): boolean {
    // Sybil indicators: new wallet, high frequency, low amounts, low diversity
    return (
      contribution.walletAge < 30 &&
      contribution.frequency > 20 &&
      contribution.amount < 100 &&
      contribution.uniqueProjects < 3
    );
  }

  /**
   * Detect wash trading patterns
   */
  private detectWashTrading(contribution: ContributionData): boolean {
    // Wash trading: repetitive amounts, high frequency, same projects
    const amountVariance = Math.abs(
      contribution.amount - contribution.averageAmount
    );
    return (
      amountVariance < 10 &&
      contribution.frequency > 15 &&
      contribution.uniqueProjects < 2
    );
  }

  /**
   * Detect unusual contribution amounts
   */
  private detectUnusualAmount(contribution: ContributionData): boolean {
    // Statistical outlier detection
    const zScore = Math.abs(
      (contribution.amount - contribution.averageAmount) / 
      (contribution.averageAmount * 0.3)
    );
    return zScore > 3; // More than 3 standard deviations
  }

  /**
   * Detect suspicious timing patterns
   */
  private detectSuspiciousTiming(contribution: ContributionData): boolean {
    // Low time variance indicates bot-like behavior
    return contribution.timeVariance < 0.1 && contribution.frequency > 10;
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidence(riskScore: number): number {
    // Higher confidence for scores far from threshold
    const distance = Math.abs(riskScore - this.threshold);
    return Math.min(1, 0.5 + distance);
  }

  /**
   * Generate human-readable explanation
   */
  private generateExplanation(
    riskScore: number,
    riskFactors: RiskFactors,
    contribution: ContributionData
  ): string {
    const reasons: string[] = [];

    if (riskFactors.sybilAttack) {
      reasons.push(
        'Sybil attack pattern detected (new wallet, high frequency, low diversity)'
      );
    }

    if (riskFactors.washTrading) {
      reasons.push(
        'Wash trading pattern detected (repetitive amounts, same projects)'
      );
    }

    if (riskFactors.unusualAmount) {
      reasons.push(
        `Unusual contribution amount (${contribution.amount} vs avg ${contribution.averageAmount})`
      );
    }

    if (riskFactors.suspiciousTiming) {
      reasons.push('Bot-like timing pattern detected');
    }

    if (riskFactors.newWallet) {
      reasons.push(`Very new wallet (${contribution.walletAge} days old)`);
    }

    if (riskFactors.lowDiversity) {
      reasons.push(
        `Low project diversity (only ${contribution.uniqueProjects} projects)`
      );
    }

    if (reasons.length === 0) {
      return riskScore > this.threshold
        ? 'Anomalous contribution pattern detected'
        : 'Contribution appears legitimate';
    }

    return reasons.join('; ');
  }

  /**
   * Analyze an entire funding round
   */
  async analyzeRound(
    contributions: ContributionData[]
  ): Promise<{
    totalContributions: number;
    flaggedContributions: number;
    averageRiskScore: number;
    highRiskContributions: FraudDetectionResult[];
    summary: string;
  }> {
    const results = await Promise.all(
      contributions.map((c) => this.analyzeContribution(c))
    );

    const flagged = results.filter((r) => r.isFraudulent);
    const avgRisk =
      results.reduce((sum, r) => sum + r.riskScore, 0) / results.length;

    return {
      totalContributions: contributions.length,
      flaggedContributions: flagged.length,
      averageRiskScore: avgRisk,
      highRiskContributions: flagged,
      summary: `Analyzed ${contributions.length} contributions. Flagged ${
        flagged.length
      } (${((flagged.length / contributions.length) * 100).toFixed(
        1
      )}%) as potentially fraudulent. Average risk score: ${avgRisk.toFixed(
        3
      )}`,
    };
  }

  /**
   * Save the trained model
   */
  async saveModel(savePath: string): Promise<void> {
    if (!this.model) {
      throw new Error('No model to save');
    }

    await this.model.save(`file://${savePath}`);
    console.log(`✅ Model saved to ${savePath}`);
  }

  /**
   * Get model summary
   */
  getModelSummary(): void {
    if (!this.model) {
      console.log('No model loaded');
      return;
    }
    this.model.summary();
  }

  /**
   * Dispose of the model and free memory
   */
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isModelLoaded = false;
      console.log('✅ Model disposed');
    }
  }
}

// Export singleton instance
export const fraudDetector = new FraudDetector();
