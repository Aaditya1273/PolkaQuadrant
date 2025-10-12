/**
 * Type definitions for AI Fraud Detection Module
 */

/**
 * Contribution data structure for analysis
 */
export interface ContributionData {
  amount: number; // Contribution amount
  frequency: number; // Number of contributions from this wallet
  walletAge: number; // Age of wallet in days
  transactionCount: number; // Total transactions in wallet history
  averageAmount: number; // Average contribution amount
  timeVariance: number; // Variance in contribution timing (0-1)
  uniqueProjects: number; // Number of unique projects contributed to
  roundParticipation: number; // Number of rounds participated in
  label?: number; // 0 = normal, 1 = fraudulent (for training)
}

/**
 * Risk factors identified in contribution
 */
export interface RiskFactors {
  sybilAttack: boolean; // Sybil attack pattern detected
  washTrading: boolean; // Wash trading pattern detected
  unusualAmount: boolean; // Statistically unusual amount
  suspiciousTiming: boolean; // Bot-like timing pattern
  newWallet: boolean; // Very new wallet
  lowDiversity: boolean; // Low project diversity
}

/**
 * Fraud detection result
 */
export interface FraudDetectionResult {
  riskScore: number; // Risk score (0-1)
  isFraudulent: boolean; // Whether contribution is flagged as fraudulent
  confidence: number; // Confidence in the prediction (0-1)
  riskFactors: RiskFactors; // Specific risk factors identified
  explanation: string; // Human-readable explanation
  timestamp: string; // ISO timestamp of analysis
}

/**
 * Round analysis result
 */
export interface RoundAnalysisResult {
  roundId: string;
  totalContributions: number;
  flaggedContributions: number;
  averageRiskScore: number;
  highRiskContributions: FraudDetectionResult[];
  summary: string;
  analyzedAt: string;
}

/**
 * Model training configuration
 */
export interface TrainingConfig {
  datasetSize: number;
  fraudPercentage: number;
  epochs: number;
  batchSize: number;
  validationSplit: number;
  learningRate: number;
}

/**
 * Model evaluation metrics
 */
export interface EvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
  confusionMatrix: number[][];
}

/**
 * Dataset statistics
 */
export interface DatasetStatistics {
  total: number;
  normal: number;
  fraudulent: number;
  fraudPercentage: number;
  averageAmount: number;
  averageWalletAge: number;
  averageFrequency: number;
}

/**
 * AI model metadata
 */
export interface ModelMetadata {
  version: string;
  trainedAt: string;
  datasetSize: number;
  accuracy: number;
  threshold: number;
  features: string[];
}

/**
 * Batch analysis request
 */
export interface BatchAnalysisRequest {
  contributions: ContributionData[];
  roundId?: string;
  threshold?: number;
}

/**
 * Batch analysis response
 */
export interface BatchAnalysisResponse {
  results: FraudDetectionResult[];
  summary: {
    total: number;
    flagged: number;
    flaggedPercentage: number;
    averageRiskScore: number;
  };
  processedAt: string;
}
