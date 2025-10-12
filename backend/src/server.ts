import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';
import blockchainRoutes from './routes/blockchain';
import betaTestingRoutes from './routes/betaTesting';
import { mainnetConnector } from './blockchain/mainnetConnector';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  const connectedNetworks = mainnetConnector.getConnectedNetworks();
  
  res.status(200).json({
    status: 'ok',
    message: 'PolkaQuadrant Backend API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1',
    features: {
      aiFraudDetection: true,
      blockchainIntegration: true,
      metricsTracking: true,
    },
    blockchain: {
      connected: connectedNetworks.length > 0,
      networks: connectedNetworks,
    },
  });
});

// API routes
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/blockchain', blockchainRoutes);
app.use('/api/v1/feedback', betaTestingRoutes);

// API root
app.get('/api/v1', (_req: Request, res: Response) => {
  res.json({
    message: 'PolkaQuadrant API v1 - AI-Secured Quadratic Funding Validator',
    endpoints: {
      health: '/health',
      ai: {
        analyzeContribution: 'POST /api/v1/ai/analyze-contribution',
        analyzeRound: 'POST /api/v1/ai/analyze-round',
        riskReport: 'GET /api/v1/ai/risk-report/:roundId',
        train: 'POST /api/v1/ai/train',
        generateDataset: 'POST /api/v1/ai/generate-dataset',
        modelInfo: 'GET /api/v1/ai/model-info',
        demo: 'GET /api/v1/ai/demo',
      },
      blockchain: {
        networks: 'GET /api/v1/blockchain/networks',
        connect: 'POST /api/v1/blockchain/connect',
        connectAll: 'POST /api/v1/blockchain/connect-all',
        switch: 'POST /api/v1/blockchain/switch',
        chainInfo: 'GET /api/v1/blockchain/chain-info',
        fundingRounds: 'GET /api/v1/blockchain/funding-rounds',
        project: 'GET /api/v1/blockchain/project/:projectId',
        balance: 'GET /api/v1/blockchain/balance/:address',
        validatePallet: 'POST /api/v1/blockchain/validate-pallet',
        blockNumber: 'GET /api/v1/blockchain/block-number',
        status: 'GET /api/v1/blockchain/status',
      },
      feedback: {
        submit: 'POST /api/v1/feedback/submit',
        list: 'GET /api/v1/feedback/list',
        metrics: 'POST /api/v1/feedback/metrics',
        getMetrics: 'GET /api/v1/feedback/metrics/:testerId',
        survey: 'POST /api/v1/feedback/survey',
        analytics: 'GET /api/v1/feedback/analytics',
        export: 'GET /api/v1/feedback/export',
        testers: 'GET /api/v1/feedback/testers',
      },
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PolkaQuadrant Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
