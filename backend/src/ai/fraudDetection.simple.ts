/**
 * Simplified Fraud Detection (No TensorFlow - Rule-based ML)
 * Perfect for hackathon demos without complex dependencies
 */

import { ContributionData } from '../types/ai';

export interface RiskFactors {
  sybilAttack: boolean;
  washTrading: boolean;
  unusualAmount: boolean;
  suspiciousTiming: boolean;
  newWallet: boolean;
  lowDiversity: boolean;
}

export interface FraudDetectionResult {
  riskScore: number;
  isFraudulent: boolean;
  confidence: number;
  riskFactors: RiskFactors;
  explanation: string;
  timestamp: string;
}

/**
 * Rule-Based Fraud Detection Engine
 * Uses statistical analysis and pattern matching
 */
export class SimpleFraudDetector {
  private threshold: number;
  public isModelLoaded: boolean = true; // Always loaded for simple version

  constructor(threshold: number = 0.7) {
    this.threshold = threshold;
  }

  /**
   * Load model (mock - always succeeds)
   */
  async loadModel(_modelPath?: string): Promise<void> {
    this.isModelLoaded = true;
    console.log('✅ Fraud detection model loaded (simple version)');
  }

  /**
   * Analyze a contribution for fraud (main method)
   */
  async analyzeContribution(contribution: ContributionData): Promise<FraudDetectionResult> {
    // Calculate risk score using weighted factors
    const riskFactors = this.analyzeRiskFactors(contribution);
    const riskScore = this.calculateRiskScore(riskFactors, contribution);
    
    const isFraudulent = riskScore > this.threshold;
    const confidence = this.calculateConfidence(riskScore);
    const explanation = this.generateExplanation(riskScore, riskFactors, contribution);

    return {
      riskScore,
      isFraudulent,
      confidence,
      riskFactors,
      explanation,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Analyze specific risk factors
   */
  private analyzeRiskFactors(contribution: ContributionData): RiskFactors {
    return {
      sybilAttack: this.detectSybilPattern(contribution),
      washTrading: this.detectWashTrading(contribution),
      unusualAmount: this.detectUnusualAmount(contribution),
      suspiciousTiming: this.detectSuspiciousTiming(contribution),
      newWallet: (contribution.walletAge || 0) < 7,
      lowDiversity: (contribution.uniqueProjects || 0) < 2,
    };
  }

  /**
   * Calculate overall risk score (0-1)
   */
  private calculateRiskScore(factors: RiskFactors, _contribution: ContributionData): number {
    let score = 0;
    let weight = 0;

    // Weighted risk calculation
    if (factors.sybilAttack) { score += 0.35; weight += 0.35; }
    if (factors.washTrading) { score += 0.30; weight += 0.30; }
    if (factors.unusualAmount) { score += 0.15; weight += 0.15; }
    if (factors.suspiciousTiming) { score += 0.10; weight += 0.10; }
    if (factors.newWallet) { score += 0.05; weight += 0.05; }
    if (factors.lowDiversity) { score += 0.05; weight += 0.05; }

    // Normalize to 0-1 range
    return weight > 0 ? Math.min(1, score / weight) : 0;
  }

  /**
   * Detect Sybil attack patterns
   */
  private detectSybilPattern(contribution: ContributionData): boolean {
    const walletAge = contribution.walletAge || 0;
    const frequency = contribution.frequency || 0;
    const amount = contribution.amount || 0;
    const uniqueProjects = contribution.uniqueProjects || 0;

    // Sybil indicators: new wallet, high frequency, low amounts, low diversity
    return (
      walletAge < 30 &&
      frequency > 20 &&
      amount < 100 &&
      uniqueProjects < 3
    );
  }

  /**
   * Detect wash trading patterns
   */
  private detectWashTrading(contribution: ContributionData): boolean {
    const amount = contribution.amount || 0;
    const averageAmount = contribution.averageAmount || amount;
    const frequency = contribution.frequency || 0;
    const uniqueProjects = contribution.uniqueProjects || 0;

    // Wash trading: repetitive amounts, high frequency, same projects
    const amountVariance = Math.abs(amount - averageAmount);
    return (
      amountVariance < 10 &&
      frequency > 15 &&
      uniqueProjects < 2
    );
  }

  /**
   * Detect unusual contribution amounts
   */
  private detectUnusualAmount(contribution: ContributionData): boolean {
    const amount = contribution.amount || 0;
    const averageAmount = contribution.averageAmount || amount;

    // Statistical outlier detection (Z-score > 3)
    const zScore = Math.abs(
      (amount - averageAmount) / (averageAmount * 0.3 || 1)
    );
    return zScore > 3;
  }

  /**
   * Detect suspicious timing patterns
   */
  private detectSuspiciousTiming(contribution: ContributionData): boolean {
    const timeVariance = contribution.timeVariance || 1;
    const frequency = contribution.frequency || 0;

    // Low time variance indicates bot-like behavior
    return timeVariance < 0.1 && frequency > 10;
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
      reasons.push('Sybil attack pattern detected (new wallet, high frequency, low diversity)');
    }

    if (riskFactors.washTrading) {
      reasons.push('Wash trading pattern detected (repetitive amounts, same projects)');
    }

    if (riskFactors.unusualAmount) {
      reasons.push(
        `Unusual contribution amount (${contribution.amount} vs avg ${contribution.averageAmount || 'N/A'})`
      );
    }

    if (riskFactors.suspiciousTiming) {
      reasons.push('Bot-like timing pattern detected');
    }

    if (riskFactors.newWallet) {
      reasons.push(`Very new wallet (${contribution.walletAge || 0} days old)`);
    }

    if (riskFactors.lowDiversity) {
      reasons.push(`Low project diversity (only ${contribution.uniqueProjects || 0} projects)`);
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
  async analyzeRound(contributions: ContributionData[]): Promise<{
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
      )}%) as potentially fraudulent. Average risk score: ${avgRisk.toFixed(3)}`,
    };
  }
}

// Export singleton instance
export const fraudDetector = new SimpleFraudDetector();
