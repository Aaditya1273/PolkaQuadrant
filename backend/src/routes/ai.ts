import { Router, Request, Response } from 'express';
import { fraudDetector } from '../ai/fraudDetection.simple';
import { dataGenerator } from '../ai/dataGenerator';
import { modelTrainer } from '../ai/training.simple';
import {
  ContributionData,
  BatchAnalysisRequest,
  BatchAnalysisResponse,
} from '../types/ai';

const router = Router();

/**
 * POST /api/v1/ai/analyze-contribution
 * Analyze a single contribution for fraud
 */
router.post('/analyze-contribution', async (req: Request, res: Response) => {
  try {
    const contribution: ContributionData = req.body;

    // Validate input
    if (!contribution || typeof contribution.amount !== 'number') {
      return res.status(400).json({
        error: 'Invalid contribution data',
        message: 'Contribution object with valid amount is required',
      });
    }

    // Ensure model is loaded
    if (!(fraudDetector as any).isModelLoaded) {
      await fraudDetector.loadModel();
    }

    // Analyze contribution
    const result = await fraudDetector.analyzeContribution(contribution);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error analyzing contribution:', error);
    return res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/ai/analyze-round
 * Analyze an entire funding round
 */
router.post('/analyze-round', async (req: Request, res: Response) => {
  try {
    const { contributions, roundId, threshold }: BatchAnalysisRequest = req.body;

    if (!contributions || !Array.isArray(contributions)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Contributions array is required',
      });
    }

    // Ensure model is loaded
    if (!(fraudDetector as any).isModelLoaded) {
      await fraudDetector.loadModel();
    }

    // Set custom threshold if provided
    if (threshold) {
      (fraudDetector as any).threshold = threshold;
    }

    // Analyze round
    const roundAnalysis = await fraudDetector.analyzeRound(contributions);

    const response: BatchAnalysisResponse = {
      results: roundAnalysis.highRiskContributions,
      summary: {
        total: roundAnalysis.totalContributions,
        flagged: roundAnalysis.flaggedContributions,
        flaggedPercentage:
          (roundAnalysis.flaggedContributions /
            roundAnalysis.totalContributions) *
          100,
        averageRiskScore: roundAnalysis.averageRiskScore,
      },
      processedAt: new Date().toISOString(),
    };

    return res.json({
      success: true,
      roundId: roundId || 'unknown',
      data: response,
      summary: roundAnalysis.summary,
    });
  } catch (error: any) {
    console.error('Error analyzing round:', error);
    return res.status(500).json({
      error: 'Round analysis failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/ai/risk-report/:roundId
 * Get detailed risk report for a round
 */
router.get('/risk-report/:roundId', async (req: Request, res: Response) => {
  try {
    const { roundId } = req.params;

    // This would typically fetch from database
    // For now, return a mock report
    return res.json({
      success: true,
      roundId,
      report: {
        generatedAt: new Date().toISOString(),
        status: 'completed',
        message: 'Risk report endpoint ready. Integrate with database for full functionality.',
      },
    });
  } catch (error: any) {
    console.error('Error generating risk report:', error);
    return res.status(500).json({
      error: 'Report generation failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/ai/train
 * Train the AI model (admin only)
 */
router.post('/train', async (req: Request, res: Response) => {
  try {
    const { mode = 'quick', datasetSize, epochs } = req.body;

    console.log(`Starting ${mode} training...`);

    switch (mode) {
      case 'quick':
        await modelTrainer.quickTrain();
        break;
      case 'production':
        await modelTrainer.productionTrain();
        break;
      case 'latam':
        await modelTrainer.trainForLATAM({ datasetSize, epochs });
        break;
      default:
        await modelTrainer.train({ datasetSize, epochs });
    }

    return res.json({
      success: true,
      message: 'Model training completed',
      mode,
    });
  } catch (error: any) {
    console.error('Error training model:', error);
    return res.status(500).json({
      error: 'Training failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/ai/generate-dataset
 * Generate synthetic dataset for testing
 */
router.post('/generate-dataset', async (req: Request, res: Response) => {
  try {
    const { count = 100, type = 'general', fraudPercentage = 0.2 } = req.body;

    let dataset;
    if (type === 'latam') {
      dataset = dataGenerator.generateLATAMDataset(count);
    } else if (type === 'buenos-aires') {
      const result = dataGenerator.generateBuenosAiresArtGrant(count);
      return res.json({
        success: true,
        data: result.contributions,
        metadata: result.metadata,
        statistics: dataGenerator.getDatasetStatistics(result.contributions),
      });
    } else {
      dataset = dataGenerator.generateDataset(count, fraudPercentage);
    }

    const statistics = dataGenerator.getDatasetStatistics(dataset);

    return res.json({
      success: true,
      data: dataset,
      statistics,
    });
  } catch (error: any) {
    console.error('Error generating dataset:', error);
    return res.status(500).json({
      error: 'Dataset generation failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/ai/model-info
 * Get information about the loaded model
 */
router.get('/model-info', async (_req: Request, res: Response) => {
  try {
    const isLoaded = (fraudDetector as any).isModelLoaded;

    if (!isLoaded) {
      return res.json({
        success: true,
        loaded: false,
        message: 'Model not loaded. Call /api/v1/ai/load-model first.',
      });
    }

    return res.json({
      success: true,
      loaded: true,
      threshold: (fraudDetector as any).threshold,
      features: [
        'amount',
        'frequency',
        'walletAge',
        'transactionCount',
        'averageAmount',
        'timeVariance',
        'uniqueProjects',
        'roundParticipation',
      ],
      version: '1.0.0',
    });
  } catch (error: any) {
    console.error('Error getting model info:', error);
    return res.status(500).json({
      error: 'Failed to get model info',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/ai/load-model
 * Load the trained model
 */
router.post('/load-model', async (req: Request, res: Response) => {
  try {
    const { modelPath } = req.body;

    await fraudDetector.loadModel(modelPath);

    return res.json({
      success: true,
      message: 'Model loaded successfully',
    });
  } catch (error: any) {
    console.error('Error loading model:', error);
    return res.status(500).json({
      error: 'Model loading failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/ai/demo
 * Demo endpoint showing AI capabilities
 */
router.get('/demo', async (_req: Request, res: Response) => {
  try {
    // Generate sample data
    const sampleData = dataGenerator.generateBuenosAiresArtGrant(20);

    // Ensure model is loaded
    if (!(fraudDetector as any).isModelLoaded) {
      await fraudDetector.loadModel();
    }

    // Analyze a few samples
    const samples = sampleData.contributions.slice(0, 5);
    const results = await Promise.all(
      samples.map((c) => fraudDetector.analyzeContribution(c))
    );

    return res.json({
      success: true,
      message: 'AI Fraud Detection Demo',
      demo: {
        sampleContributions: samples,
        analysisResults: results,
        statistics: sampleData.metadata,
      },
      capabilities: {
        sybilDetection: true,
        washTradingDetection: true,
        anomalyDetection: true,
        riskScoring: true,
        batchAnalysis: true,
      },
    });
  } catch (error: any) {
    console.error('Error running demo:', error);
    return res.status(500).json({
      error: 'Demo failed',
      message: error.message,
    });
  }
});

export default router;
