# 📚 PolkaQuadrant API Reference

Complete API documentation for PolkaQuadrant backend services.

**Base URL**: `http://localhost:4000/api/v1`  
**Production URL**: `https://polkaquadrant-backend.up.railway.app/api/v1`  
**Version**: 1.0.0  
**Protocol**: REST  
**Format**: JSON

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Fraud Detection APIs](#fraud-detection-apis)
- [Metrics APIs](#metrics-apis)
- [Beta Testing APIs](#beta-testing-apis)
- [Mainnet Query APIs](#mainnet-query-apis)

---

## 🔐 Authentication

Currently open for beta testing. Production will require:
```http
Authorization: Bearer <your_api_token>
```

---

## ⚡ Rate Limiting

- General: 100 req/min
- AI Analysis: 50 req/min
- Blockchain: 200 req/min

**Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## ❌ Error Handling

### Standard Error Response
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes
- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 429: Rate Limit
- 500: Server Error

---

## 🤖 Fraud Detection APIs

### POST /api/v1/ai/analyze-contribution

Analyze single contribution for fraud.

**Request**:
```json
{
  "contributorAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "projectId": "proj_123",
  "amount": 100,
  "timestamp": "2024-01-30T12:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "fraudScore": 0.15,
    "isFraudulent": false,
    "confidence": 0.92,
    "patterns": {
      "sybilAttack": { "detected": false, "score": 0.05 },
      "washTrading": { "detected": false, "score": 0.08 },
      "botBehavior": { "detected": false, "score": 0.02 }
    },
    "riskLevel": "low"
  }
}
```

**cURL**:
```bash
curl -X POST http://localhost:4000/api/v1/ai/analyze-contribution \
  -H "Content-Type: application/json" \
  -d '{"contributorAddress":"0x742d...","amount":100}'
```

---

### POST /api/v1/ai/analyze-round

Analyze entire funding round.

**Request**:
```json
{
  "roundId": "round_123",
  "contributions": [
    {
      "contributorAddress": "0x742d...",
      "amount": 100
    }
  ],
  "threshold": 0.7
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 150,
      "flagged": 12,
      "flaggedPercentage": 8.0,
      "averageRiskScore": 0.25
    }
  }
}
```

---

### GET /api/v1/ai/risk-report/:roundId

Get comprehensive risk report.

**Parameters**:
- `roundId`: Round identifier
- `format`: json | pdf | csv

**Response**:
```json
{
  "success": true,
  "report": {
    "overview": {
      "totalContributions": 150,
      "flaggedContributions": 12,
      "riskLevel": "medium"
    },
    "fraudPatterns": {
      "sybilAttacks": { "detected": 8, "confidence": 0.89 },
      "washTrading": { "detected": 3, "confidence": 0.76 }
    }
  }
}
```

---

## 📊 Metrics APIs

### GET /api/v1/metrics/overview

System metrics and statistics.

**Parameters**:
- `period`: 24h | 7d | 30d | all

**Response**:
```json
{
  "success": true,
  "metrics": {
    "contributions": {
      "total": 1250,
      "flagged": 45,
      "flaggedPercentage": 3.6
    },
    "performance": {
      "averageAnalysisTime": "125ms",
      "apiUptime": "99.98%"
    }
  }
}
```

---

### GET /api/v1/metrics/coverage

Test coverage statistics.

**Response**:
```json
{
  "success": true,
  "coverage": {
    "overall": {
      "lines": 96.5,
      "branches": 94.2,
      "functions": 97.8
    }
  }
}
```

---

### GET /api/v1/metrics/performance

API performance benchmarks.

**Response**:
```json
{
  "success": true,
  "performance": {
    "endpoints": [
      {
        "path": "/api/v1/ai/analyze-contribution",
        "avgLatency": "125ms",
        "p99": "450ms"
      }
    ]
  }
}
```

---

## 🧪 Beta Testing APIs

### POST /api/v1/feedback/submit

Submit beta feedback.

**Request**:
```json
{
  "testerId": "tester_001",
  "testerName": "Sofia M.",
  "usabilityScore": 4.5,
  "comments": "Great platform!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": "feedback_...",
    "status": "new"
  }
}
```

---

### GET /api/v1/feedback/stats

Feedback statistics.

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalTesters": 3,
    "avgUsabilityScore": 4.57,
    "featureRatings": [
      {
        "feature": "ai-fraud-detection",
        "avgRating": 5.0
      }
    ]
  }
}
```

---

## ⛓️ Mainnet Query APIs

### GET /api/v1/blockchain/rounds

Get funding rounds.

**Parameters**:
- `status`: active | completed | all
- `network`: rococo | acala
- `limit`: Number of results

**Response**:
```json
{
  "success": true,
  "data": {
    "rounds": [
      {
        "roundId": "round_123",
        "name": "LATAM Community Grants",
        "status": "active",
        "matchingPool": "500 DOT",
        "projectCount": 15
      }
    ]
  }
}
```

---

### GET /api/v1/blockchain/projects/:id

Get project details.

**Response**:
```json
{
  "success": true,
  "data": {
    "projectId": "proj_123",
    "name": "Buenos Aires Art Grants",
    "funding": {
      "totalAmount": "12.5 DOT",
      "matchingAmount": "25 DOT"
    },
    "contributors": { "count": 42 }
  }
}
```

---

### GET /api/v1/blockchain/contributions/:roundId

Get round contributions.

**Parameters**:
- `projectId`: Filter by project
- `minAmount`: Minimum amount
- `sortBy`: amount | timestamp

**Response**:
```json
{
  "success": true,
  "data": {
    "contributions": [
      {
        "contributor": "0x742d...",
        "amount": "1 DOT",
        "fraudScore": 0.12
      }
    ],
    "summary": {
      "totalContributions": 125,
      "totalAmount": "45 DOT"
    }
  }
}
```

---

## 📖 Additional Resources

- [OpenAPI Specification](./openapi.yaml)
- [Postman Collection](./postman_collection.json)
- [Code Examples](./examples/)

**Last Updated**: 2024-01-30  
**API Version**: 1.0.0
