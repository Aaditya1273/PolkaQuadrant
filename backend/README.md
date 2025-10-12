# PolkaQuadrant Backend

Express.js API server with AI fraud detection and blockchain integration.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **AI/ML**: TensorFlow.js
- **Blockchain**: Polkadot.js API
- **Database**: Supabase (PostgreSQL)
- **Testing**: Jest
- **Logging**: Winston

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

### Development

```bash
npm run dev
```

Server runs on [http://localhost:4000](http://localhost:4000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── server.ts           # Main server file
├── ai/                 # AI/ML modules
│   ├── fraudDetection.ts
│   ├── training.ts
│   └── dataGenerator.ts
├── blockchain/         # Blockchain integration
│   ├── mainnetConnector.ts
│   └── queryService.ts
├── routes/            # API routes
│   ├── ai.ts
│   ├── blockchain.ts
│   ├── metrics.ts
│   └── feedback.ts
├── middleware/        # Express middleware
│   ├── auth.ts
│   ├── rateLimit.ts
│   └── errorHandler.ts
├── utils/            # Utility functions
├── types/            # TypeScript types
└── config/           # Configuration
```

## API Endpoints

### Health Check
```
GET /health
```

### AI Fraud Detection
```
POST /api/v1/ai/analyze-contribution
POST /api/v1/ai/analyze-round
GET  /api/v1/ai/risk-report/:roundId
```

### Blockchain Queries
```
GET /api/v1/blockchain/rounds
GET /api/v1/blockchain/projects/:id
GET /api/v1/blockchain/contributions/:roundId
```

### Metrics
```
GET /api/v1/metrics/overview
GET /api/v1/metrics/coverage
```

### Beta Testing
```
POST /api/v1/feedback/submit
GET  /api/v1/feedback/stats
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## AI Model

The fraud detection model uses TensorFlow.js for:
- Anomaly detection in contribution patterns
- Sybil attack identification
- Risk scoring (0-1 scale)

Model files stored in: `./models/fraud_detection/`

## Database Schema

Using Supabase PostgreSQL for:
- Beta tester feedback
- Metrics aggregation
- User analytics
- Simulation results

## Environment Variables

See `.env.example` for all required variables.

## Security

- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting
- JWT authentication
- Input validation

## Logging

Winston logger with:
- Console output (development)
- File output (production)
- Error tracking
- Request logging

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

## Learn More

- [Express.js](https://expressjs.com/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Polkadot.js API](https://polkadot.js.org/docs/api)
