# LATAM Quadratic Funding Simulations

Realistic simulations of Latin American quadratic funding rounds with AI fraud detection validation.

## Overview

This simulation suite creates realistic funding scenarios for three major LATAM cities, injecting various types of fraud attacks and validating AI detection accuracy.

## Simulations

### 1. Buenos Aires Community Art Grant
- **Location:** Buenos Aires, Argentina
- **Contributions:** 100
- **Projects:** 12
- **Matching Pool:** $50,000
- **Fraud Rate:** 12%

### 2. Mexico City Tech Commons
- **Location:** Mexico City, Mexico
- **Contributions:** 150
- **Projects:** 18
- **Matching Pool:** $75,000
- **Fraud Rate:** 15%

### 3. São Paulo Social Impact Fund
- **Location:** São Paulo, Brazil
- **Contributions:** 200
- **Projects:** 24
- **Matching Pool:** $100,000
- **Fraud Rate:** 10%

## Attack Types

### Sybil Attacks (40% of fraud)
- Multiple fake identities controlled by single entity
- Small, similar contribution amounts
- New wallets with minimal history
- Clustered timing patterns

### Wash Trading (35% of fraud)
- Repetitive contributions from same wallet
- Consistent amounts
- High velocity (rapid succession)
- Mechanical timing patterns

### Bot Behavior (25% of fraud)
- Perfectly timed contributions
- Exact same amounts
- Mechanical intervals
- No human variation

## Features

### Realistic Data Generation
- Power law distribution for contribution amounts
- Varied wallet ages and transaction histories
- Regional contributor profiles
- Natural timing variations

### AI Detection
- Feature extraction from contribution patterns
- Risk score calculation (0-1)
- Multi-factor fraud detection
- Confidence scoring

### Comprehensive Metrics
- Accuracy, Precision, Recall, F1 Score
- False Positive/Negative rates
- Confusion matrices
- Processing time benchmarks

### Funding Analysis
- Before/after fraud removal comparison
- Quadratic funding calculations
- Project-level impact analysis
- Fairness improvement metrics

## Usage

### Run Simulations

```bash
cd scripts/simulations
node latinAmericaGrants.js
```

**Output:**
- Console logs with detailed progress
- JSON results file in `results/` directory
- Timestamp-based filename

### Analyze Results

```bash
node analyzeResults.js
```

**Output:**
- Detailed analysis report (console)
- CSV export for spreadsheet analysis
- Markdown report for documentation

### Example Output

```
🌎 LATAM Quadratic Funding Simulations
=====================================

🎯 Running Simulation: Buenos Aires Community Art Grant
📍 Location: Buenos Aires, Argentina
💰 Matching Pool: $50,000
📊 Target Contributions: 100
⚠️  Fraud Rate: 12.0%

✅ Legitimate contributions: 88
❌ Fraudulent contributions: 12

🎭 Attack Distribution:
   Sybil Attacks: 5
   Wash Trading: 4
   Bot Behavior: 3

✅ Generated 100 total contributions

🤖 Running AI Fraud Detection...

📊 SIMULATION SUMMARY
====================

Buenos Aires Community Art Grant:
  Accuracy: 91.00%
  Precision: 83.33%
  Recall: 83.33%
  F1 Score: 83.33%
  False Positive Rate: 2.27%
  Processing Time: 45ms
```

## Output Files

### JSON Results
```json
{
  "buenosAires": {
    "config": { ... },
    "projects": [ ... ],
    "contributions": [ ... ],
    "detectionResults": [ ... ],
    "metrics": {
      "accuracy": "91.00%",
      "precision": "83.33%",
      "recall": "83.33%",
      "f1Score": "83.33%",
      "falsePositiveRate": "2.27%",
      "falseNegativeRate": "16.67%"
    },
    "fundingBefore": { ... },
    "fundingAfter": { ... },
    "processingTime": 45
  }
}
```

### CSV Export
```csv
Simulation,Location,Total Contributions,Fraud Count,Fraud Rate,Accuracy,Precision,Recall,F1 Score,False Positive Rate,False Negative Rate,Processing Time (ms),Throughput (contrib/s)
Buenos Aires Community Art Grant,Buenos Aires Argentina,100,12,12.00%,91.00%,83.33%,83.33%,83.33%,2.27%,16.67%,45,2222
```

### Markdown Report
Complete analysis report with:
- Executive summary
- Individual simulation results
- Detection metrics tables
- Confusion matrices
- Performance comparisons

## Data Structure

### Contribution Object
```javascript
{
  contributorId: "buenosaires-contributor-1",
  walletAddress: "5GrwvaEF...",
  projectId: "project-3",
  amount: 125.50,
  timestamp: 1699999999,
  frequency: 1,
  velocity: 0.15,
  walletAge: 365,
  transactionCount: 45,
  previousContributions: 3,
  diversityScore: 0.6,
  timingPattern: 0.2,
  isLegitimate: true
}
```

### Detection Result
```javascript
{
  contributionId: "buenosaires-contributor-1",
  isFraudulent: false,
  riskScore: 0.25,
  confidence: 0.85,
  explanation: "Normal contribution pattern",
  actualLabel: false
}
```

### Funding Distribution
```javascript
{
  "project-1": {
    directFunding: 1250.00,
    quadraticSum: 3125.50,
    contributorCount: 15,
    matchingFunds: 8500.00,
    totalFunding: 9750.00
  }
}
```

## Metrics Explained

### Accuracy
Percentage of correct predictions (both fraud and legitimate).

**Formula:** `(TP + TN) / Total`

### Precision
Of all predicted fraud, what percentage was actually fraud?

**Formula:** `TP / (TP + FP)`

### Recall (Sensitivity)
Of all actual fraud, what percentage was detected?

**Formula:** `TP / (TP + FN)`

### F1 Score
Harmonic mean of precision and recall.

**Formula:** `2 * (Precision * Recall) / (Precision + Recall)`

### False Positive Rate
Percentage of legitimate contributions incorrectly flagged as fraud.

**Formula:** `FP / (FP + TN)`

### False Negative Rate
Percentage of fraudulent contributions that went undetected.

**Formula:** `FN / (FN + TP)`

## Quadratic Funding

### Formula
For each project:
1. Sum the square roots of all contributions: `Σ√amount`
2. Square the result: `(Σ√amount)²`
3. Distribute matching pool proportionally

### Example
```
Project A: 3 contributions of $100, $50, $25
  √100 + √50 + √25 = 10 + 7.07 + 5 = 22.07
  (22.07)² = 487.08
  
Project B: 1 contribution of $175
  √175 = 13.23
  (13.23)² = 175

Total quadratic sum = 487.08 + 175 = 662.08

Matching pool = $10,000

Project A gets: (487.08 / 662.08) * $10,000 = $7,356
Project B gets: (175 / 662.08) * $10,000 = $2,644
```

## Performance Benchmarks

### Expected Performance
- **Processing Speed:** 2,000-3,000 contributions/second
- **Detection Accuracy:** 85-95%
- **Precision:** 80-90%
- **Recall:** 80-90%
- **F1 Score:** 80-90%

### Optimization Tips
1. Batch process contributions
2. Cache feature calculations
3. Use parallel processing for multiple simulations
4. Pre-compute common patterns

## Customization

### Add New Simulation
```javascript
const SIMULATIONS = {
  // ... existing simulations
  
  newCity: {
    name: 'New City Grant',
    location: 'New City, Country',
    totalContributions: 120,
    projects: 15,
    matchingPool: 60000,
    fraudRate: 0.13,
  },
};
```

### Adjust Fraud Distribution
```javascript
// In runSimulation function
const sybilCount = Math.floor(fraudCount * 0.5); // 50% Sybil
const washCount = Math.floor(fraudCount * 0.3); // 30% Wash
const botCount = fraudCount - sybilCount - washCount; // 20% Bot
```

### Modify Detection Thresholds
```javascript
// In predictFraud function
const isFraudulent = riskScore > 0.70; // Increase threshold
```

## Integration

### With Backend API
```javascript
const { fraudDetector } = require('../../backend/src/ai/fraudDetection');

// Use real AI model instead of simulation
const result = await fraudDetector.analyzeContribution(contributionData);
```

### With Frontend Dashboard
```javascript
// Load simulation results
fetch('/api/v1/simulations/latest')
  .then(res => res.json())
  .then(data => displayResults(data));
```

### With Blockchain
```javascript
const { mainnetConnector } = require('../../backend/src/blockchain/mainnetConnector');

// Fetch real contributions from blockchain
const contributions = await mainnetConnector.queryContributions(roundId);
```

## Troubleshooting

### No Results Generated
**Problem:** Script runs but no JSON file created

**Solution:**
```bash
# Check if results directory exists
mkdir -p scripts/simulations/results

# Check write permissions
chmod 755 scripts/simulations/results
```

### Low Detection Accuracy
**Problem:** Accuracy below 80%

**Solution:**
- Adjust fraud detection thresholds
- Increase feature weights
- Add more detection rules
- Train with more data

### Slow Processing
**Problem:** Processing takes too long

**Solution:**
- Reduce contribution count
- Disable detailed logging
- Use batch processing
- Optimize feature extraction

## Future Enhancements

- [ ] Real AI model integration
- [ ] Historical data analysis
- [ ] Multi-round simulations
- [ ] Network effects modeling
- [ ] Collusion detection
- [ ] Temporal analysis
- [ ] Geographic clustering
- [ ] Visualization dashboard

## References

- Quadratic Funding: https://wtfisqf.com/
- Gitcoin Grants: https://gitcoin.co/grants
- Vitalik's QF Paper: https://arxiv.org/abs/1809.06421
- Sybil Resistance: https://en.wikipedia.org/wiki/Sybil_attack

## License

MIT License - See LICENSE file for details
