# AI Fraud Detection Module

TensorFlow.js-powered fraud detection for Quadratic Funding contributions.

## Overview

This module uses an autoencoder neural network to detect anomalous contribution patterns in quadratic funding rounds. It identifies:

- **Sybil Attacks**: Multiple fake identities from same source
- **Wash Trading**: Repetitive back-and-forth contributions
- **Bot Behavior**: Mechanical, non-human patterns
- **Statistical Anomalies**: Unusual amounts or timing

## Architecture

### Autoencoder Approach

The model uses an unsupervised learning approach:
1. Trains on normal contribution patterns
2. Learns to reconstruct normal behavior
3. High reconstruction error = anomaly = potential fraud

### Model Structure

```
Input (8 features)
    ↓
Encoder (8 → 6 → 4 → 2)
    ↓
Bottleneck (2 neurons)
    ↓
Decoder (2 → 4 → 6 → 8)
    ↓
Output (8 features)
```

## Features

The model analyzes 8 key features:

1. **amount**: Contribution amount
2. **frequency**: Number of contributions from wallet
3. **walletAge**: Age of wallet in days
4. **transactionCount**: Total transactions in history
5. **averageAmount**: Average contribution amount
6. **timeVariance**: Variance in contribution timing (0-1)
7. **uniqueProjects**: Number of unique projects supported
8. **roundParticipation**: Number of rounds participated in

## Files

- **fraudDetection.ts**: Main AI model and detection logic
- **dataGenerator.ts**: Synthetic dataset generation
- **training.ts**: Model training pipeline
- **README.md**: This file

## Usage

### 1. Train the Model

```typescript
import { modelTrainer } from './training';

// Quick training (development)
await modelTrainer.quickTrain();

// Production training
await modelTrainer.productionTrain();

// LATAM-specific training
await modelTrainer.trainForLATAM();
```

### 2. Analyze Contributions

```typescript
import { fraudDetector } from './fraudDetection';

// Load model
await fraudDetector.loadModel();

// Analyze single contribution
const result = await fraudDetector.analyzeContribution({
  amount: 5000,
  frequency: 3,
  walletAge: 120,
  transactionCount: 50,
  averageAmount: 4500,
  timeVariance: 0.6,
  uniqueProjects: 8,
  roundParticipation: 2,
});

console.log(result.riskScore); // 0.0 - 1.0
console.log(result.isFraudulent); // boolean
console.log(result.explanation); // human-readable
```

### 3. Analyze Entire Round

```typescript
const roundAnalysis = await fraudDetector.analyzeRound(contributions);

console.log(roundAnalysis.summary);
console.log(`Flagged: ${roundAnalysis.flaggedContributions}`);
```

## API Endpoints

### POST /api/v1/ai/analyze-contribution
Analyze a single contribution.

**Request:**
```json
{
  "amount": 5000,
  "frequency": 3,
  "walletAge": 120,
  "transactionCount": 50,
  "averageAmount": 4500,
  "timeVariance": 0.6,
  "uniqueProjects": 8,
  "roundParticipation": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "riskScore": 0.23,
    "isFraudulent": false,
    "confidence": 0.87,
    "riskFactors": {
      "sybilAttack": false,
      "washTrading": false,
      "unusualAmount": false,
      "suspiciousTiming": false,
      "newWallet": false,
      "lowDiversity": false
    },
    "explanation": "Contribution appears legitimate",
    "timestamp": "2025-10-12T12:00:00.000Z"
  }
}
```

### POST /api/v1/ai/analyze-round
Analyze multiple contributions.

### POST /api/v1/ai/train
Train the model (admin only).

### GET /api/v1/ai/demo
See AI capabilities demo.

## Training

### Quick Training (Development)
```bash
# 1,000 samples, 20 epochs
curl -X POST http://localhost:4000/api/v1/ai/train \
  -H "Content-Type: application/json" \
  -d '{"mode": "quick"}'
```

### Production Training
```bash
# 50,000 samples, 100 epochs
curl -X POST http://localhost:4000/api/v1/ai/train \
  -H "Content-Type: application/json" \
  -d '{"mode": "production"}'
```

### LATAM-Specific Training
```bash
curl -X POST http://localhost:4000/api/v1/ai/train \
  -H "Content-Type: application/json" \
  -d '{"mode": "latam", "datasetSize": 10000}'
```

## Performance Metrics

Typical performance on test data:

- **Accuracy**: 87-92%
- **Precision**: 85-90%
- **Recall**: 80-88%
- **F1 Score**: 83-89%

## Risk Scoring

Risk scores range from 0.0 (safe) to 1.0 (high risk):

- **0.0 - 0.3**: Low risk (legitimate)
- **0.3 - 0.5**: Medium risk (monitor)
- **0.5 - 0.7**: High risk (flag for review)
- **0.7 - 1.0**: Very high risk (likely fraudulent)

Default threshold: **0.7**

## Dataset Generation

Generate synthetic datasets for training/testing:

```typescript
import { dataGenerator } from './dataGenerator';

// General dataset
const dataset = dataGenerator.generateDataset(10000, 0.2); // 20% fraud

// LATAM-specific
const latamDataset = dataGenerator.generateLATAMDataset(10000);

// Buenos Aires Art Grant
const baGrant = dataGenerator.generateBuenosAiresArtGrant(100);
```

## Model Persistence

Models are saved to: `./models/fraud_detection/`

```
models/
└── fraud_detection/
    ├── model.json
    ├── weights.bin
    └── training_data_sample.json
```

## Best Practices

1. **Train on diverse data**: Include various fraud patterns
2. **Regular retraining**: Update model with new patterns
3. **Adjust threshold**: Based on your risk tolerance
4. **Combine with rules**: Use AI + manual review
5. **Monitor performance**: Track false positives/negatives

## Limitations

- Requires sufficient training data
- May have false positives on unusual legitimate behavior
- Cannot detect all fraud types
- Needs periodic retraining

## Future Improvements

- [ ] Add more features (IP analysis, device fingerprinting)
- [ ] Implement ensemble methods
- [ ] Real-time learning
- [ ] Explainable AI (SHAP values)
- [ ] Cross-chain analysis

## References

- TensorFlow.js: https://www.tensorflow.org/js
- Autoencoder: https://en.wikipedia.org/wiki/Autoencoder
- Anomaly Detection: https://en.wikipedia.org/wiki/Anomaly_detection
