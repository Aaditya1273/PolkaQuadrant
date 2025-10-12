import * as tf from '@tensorflow/tfjs-node';
import { FraudDetector } from './fraudDetection';
import { DataGenerator } from './dataGenerator';
import { ContributionData } from '../types/ai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Training Pipeline for Fraud Detection Model
 * Trains the autoencoder on synthetic quadratic funding data
 */
export class ModelTrainer {
  private detector: FraudDetector;
  private dataGenerator: DataGenerator;
  private modelSavePath: string;

  constructor(modelSavePath: string = './models/fraud_detection') {
    this.detector = new FraudDetector();
    this.dataGenerator = new DataGenerator();
    this.modelSavePath = modelSavePath;
  }

  /**
   * Prepare training data from contributions
   */
  private prepareTrainingData(contributions: ContributionData[]): {
    features: tf.Tensor2D;
    labels: tf.Tensor1D;
  } {
    // Filter only normal contributions for autoencoder training
    const normalContributions = contributions.filter((c) => c.label === 0);

    const features = normalContributions.map((c) => [
      this.normalize(c.amount, 0, 100000),
      this.normalize(c.frequency, 0, 100),
      this.normalize(c.walletAge, 0, 365),
      this.normalize(c.transactionCount, 0, 1000),
      this.normalize(c.averageAmount, 0, 50000),
      this.normalize(c.timeVariance, 0, 1),
      this.normalize(c.uniqueProjects, 0, 50),
      this.normalize(c.roundParticipation, 0, 10),
    ]);

    const labels = normalContributions.map((c) => c.label);

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor1d(labels),
    };
  }

  /**
   * Normalize value to 0-1 range
   */
  private normalize(value: number, min: number, max: number): number {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  /**
   * Train the fraud detection model
   */
  async train(options: {
    datasetSize?: number;
    fraudPercentage?: number;
    epochs?: number;
    batchSize?: number;
    validationSplit?: number;
  } = {}): Promise<{
    history: tf.History;
    metrics: TrainingMetrics;
  }> {
    const {
      datasetSize = 10000,
      fraudPercentage = 0.2,
      epochs = 50,
      batchSize = 32,
      validationSplit = 0.2,
    } = options;

    console.log('🚀 Starting fraud detection model training...');
    console.log(`📊 Dataset size: ${datasetSize}`);
    console.log(`⚠️  Fraud percentage: ${(fraudPercentage * 100).toFixed(1)}%`);

    // Generate synthetic dataset
    console.log('📝 Generating synthetic dataset...');
    const dataset = this.dataGenerator.generateDataset(
      datasetSize,
      fraudPercentage
    );

    // Show dataset statistics
    const stats = this.dataGenerator.getDatasetStatistics(dataset);
    console.log('📈 Dataset Statistics:');
    console.log(`   Total samples: ${stats.total}`);
    console.log(`   Normal: ${stats.normal} (${(100 - stats.fraudPercentage).toFixed(1)}%)`);
    console.log(`   Fraudulent: ${stats.fraudulent} (${stats.fraudPercentage.toFixed(1)}%)`);
    console.log(`   Avg amount: ${stats.averageAmount.toFixed(2)}`);
    console.log(`   Avg wallet age: ${stats.averageWalletAge.toFixed(1)} days`);

    // Prepare training data
    console.log('🔧 Preparing training data...');
    const { features, labels } = this.prepareTrainingData(dataset);

    // Initialize model
    await this.detector.loadModel();

    // Train the model
    console.log('🎯 Training model...');
    const history = await (this.detector as any).model.fit(features, features, {
      epochs,
      batchSize,
      validationSplit,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch: number, logs: any) => {
          if (epoch % 10 === 0) {
            console.log(
              `Epoch ${epoch + 1}/${epochs} - loss: ${logs.loss.toFixed(
                4
              )} - val_loss: ${logs.val_loss.toFixed(4)}`
            );
          }
        },
      },
    });

    // Evaluate model
    console.log('📊 Evaluating model...');
    const metrics = await this.evaluateModel(dataset);

    // Save model
    console.log('💾 Saving model...');
    await this.saveModel();

    // Save training data sample
    await this.saveTrainingDataSample(dataset.slice(0, 100));

    console.log('✅ Training complete!');
    console.log(`📁 Model saved to: ${this.modelSavePath}`);

    // Clean up tensors
    features.dispose();
    labels.dispose();

    return { history, metrics };
  }

  /**
   * Evaluate model performance
   */
  private async evaluateModel(
    testData: ContributionData[]
  ): Promise<TrainingMetrics> {
    const results = await Promise.all(
      testData.map((c) => this.detector.analyzeContribution(c))
    );

    let truePositives = 0;
    let trueNegatives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;

    testData.forEach((contribution, index) => {
      const prediction = results[index];
      const actualFraud = contribution.label === 1;
      const predictedFraud = prediction.isFraudulent;

      if (actualFraud && predictedFraud) truePositives++;
      else if (!actualFraud && !predictedFraud) trueNegatives++;
      else if (!actualFraud && predictedFraud) falsePositives++;
      else if (actualFraud && !predictedFraud) falseNegatives++;
    });

    const accuracy =
      (truePositives + trueNegatives) / testData.length;
    const precision =
      truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score =
      (2 * precision * recall) / (precision + recall) || 0;

    const metrics: TrainingMetrics = {
      accuracy,
      precision,
      recall,
      f1Score,
      truePositives,
      trueNegatives,
      falsePositives,
      falseNegatives,
    };

    console.log('📊 Model Performance Metrics:');
    console.log(`   Accuracy:  ${(accuracy * 100).toFixed(2)}%`);
    console.log(`   Precision: ${(precision * 100).toFixed(2)}%`);
    console.log(`   Recall:    ${(recall * 100).toFixed(2)}%`);
    console.log(`   F1 Score:  ${(f1Score * 100).toFixed(2)}%`);
    console.log(`   True Positives:  ${truePositives}`);
    console.log(`   True Negatives:  ${trueNegatives}`);
    console.log(`   False Positives: ${falsePositives}`);
    console.log(`   False Negatives: ${falseNegatives}`);

    return metrics;
  }

  /**
   * Save the trained model
   */
  private async saveModel(): Promise<void> {
    // Ensure directory exists
    if (!fs.existsSync(this.modelSavePath)) {
      fs.mkdirSync(this.modelSavePath, { recursive: true });
    }

    await this.detector.saveModel(this.modelSavePath);
  }

  /**
   * Save a sample of training data for reference
   */
  private async saveTrainingDataSample(
    sample: ContributionData[]
  ): Promise<void> {
    const samplePath = path.join(
      this.modelSavePath,
      'training_data_sample.json'
    );
    const json = this.dataGenerator.exportToJSON(sample);

    fs.writeFileSync(samplePath, json);
    console.log(`📄 Training data sample saved to: ${samplePath}`);
  }

  /**
   * Train specifically for LATAM use case
   */
  async trainForLATAM(options: {
    datasetSize?: number;
    epochs?: number;
  } = {}): Promise<{
    history: tf.History;
    metrics: TrainingMetrics;
  }> {
    const { datasetSize = 10000, epochs = 50 } = options;

    console.log('🌎 Training model for LATAM use case...');

    // Generate LATAM-specific dataset
    const dataset = this.dataGenerator.generateLATAMDataset(datasetSize);

    // Prepare and train
    const { features } = this.prepareTrainingData(dataset);

    await this.detector.loadModel();

    const history = await (this.detector as any).model.fit(features, features, {
      epochs,
      batchSize: 32,
      validationSplit: 0.2,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch: number, logs: any) => {
          if (epoch % 10 === 0) {
            console.log(
              `Epoch ${epoch + 1}/${epochs} - loss: ${logs.loss.toFixed(4)}`
            );
          }
        },
      },
    });

    const metrics = await this.evaluateModel(dataset);

    await this.saveModel();

    features.dispose();

    return { history, metrics };
  }

  /**
   * Quick training for development/testing
   */
  async quickTrain(): Promise<void> {
    console.log('⚡ Quick training (small dataset, few epochs)...');
    await this.train({
      datasetSize: 1000,
      epochs: 20,
      batchSize: 16,
    });
  }

  /**
   * Full production training
   */
  async productionTrain(): Promise<void> {
    console.log('🏭 Production training (large dataset, many epochs)...');
    await this.train({
      datasetSize: 50000,
      epochs: 100,
      batchSize: 64,
    });
  }
}

/**
 * Training metrics interface
 */
export interface TrainingMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
}

/**
 * CLI training script
 */
export async function trainModel(args: {
  mode?: 'quick' | 'production' | 'latam';
  savePath?: string;
}): Promise<void> {
  const { mode = 'quick', savePath } = args;

  const trainer = new ModelTrainer(savePath);

  try {
    switch (mode) {
      case 'quick':
        await trainer.quickTrain();
        break;
      case 'production':
        await trainer.productionTrain();
        break;
      case 'latam':
        await trainer.trainForLATAM();
        break;
      default:
        await trainer.quickTrain();
    }

    console.log('🎉 Training completed successfully!');
  } catch (error) {
    console.error('❌ Training failed:', error);
    throw error;
  }
}

// Export singleton instance
export const modelTrainer = new ModelTrainer();
