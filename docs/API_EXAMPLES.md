# 🔧 API Examples & Code Snippets

Practical examples for integrating with PolkaQuadrant API.

---

## 📋 Table of Contents

- [JavaScript/TypeScript](#javascripttypescript)
- [Python](#python)
- [cURL](#curl)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🟨 JavaScript/TypeScript

### Setup

```typescript
const API_BASE_URL = 'http://localhost:4000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Analyze Single Contribution

```typescript
async function analyzeContribution(contribution: {
  contributorAddress: string;
  projectId: string;
  amount: number;
  timestamp?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/ai/analyze-contribution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contribution),
  });

  const result: ApiResponse<any> = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Analysis failed');
  }

  return result.data;
}

// Usage
const analysis = await analyzeContribution({
  contributorAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  projectId: 'proj_123',
  amount: 100,
  timestamp: new Date().toISOString(),
});

console.log('Fraud Score:', analysis.fraudScore);
console.log('Risk Level:', analysis.riskLevel);
```

### Analyze Funding Round

```typescript
async function analyzeRound(roundId: string, contributions: any[]) {
  const response = await fetch(`${API_BASE_URL}/ai/analyze-round`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roundId,
      contributions,
      threshold: 0.7,
    }),
  });

  return await response.json();
}

// Usage
const roundAnalysis = await analyzeRound('round_123', [
  {
    contributorAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    projectId: 'proj_123',
    amount: 100,
  },
  // ... more contributions
]);

console.log('Total:', roundAnalysis.data.summary.total);
console.log('Flagged:', roundAnalysis.data.summary.flagged);
```

### Get Funding Rounds

```typescript
async function getFundingRounds(params: {
  status?: 'active' | 'completed' | 'all';
  network?: string;
  limit?: number;
}) {
  const queryParams = new URLSearchParams(params as any);
  const response = await fetch(
    `${API_BASE_URL}/blockchain/rounds?${queryParams}`
  );

  return await response.json();
}

// Usage
const rounds = await getFundingRounds({
  status: 'active',
  network: 'rococo',
  limit: 10,
});

rounds.data.rounds.forEach((round: any) => {
  console.log(`${round.name}: ${round.matchingPoolFormatted}`);
});
```

### Submit Feedback

```typescript
async function submitFeedback(feedback: {
  testerId: string;
  testerName: string;
  usabilityScore: number;
  comments: string;
}) {
  const response = await fetch(`${API_BASE_URL}/feedback/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  });

  return await response.json();
}

// Usage
const result = await submitFeedback({
  testerId: 'tester_001',
  testerName: 'John Doe',
  usabilityScore: 4.5,
  comments: 'Great platform!',
});
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useFraudAnalysis(contribution: any) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contribution) return;

    setLoading(true);
    analyzeContribution(contribution)
      .then(setAnalysis)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [contribution]);

  return { analysis, loading, error };
}

// Usage in component
function ContributionAnalyzer({ contribution }) {
  const { analysis, loading, error } = useFraudAnalysis(contribution);

  if (loading) return <div>Analyzing...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!analysis) return null;

  return (
    <div>
      <h3>Fraud Analysis</h3>
      <p>Score: {analysis.fraudScore}</p>
      <p>Risk: {analysis.riskLevel}</p>
    </div>
  );
}
```

---

## 🐍 Python

### Setup

```python
import requests
from typing import Dict, Any, Optional

API_BASE_URL = 'http://localhost:4000/api/v1'

class PolkaQuadrantAPI:
    def __init__(self, base_url: str = API_BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json'
        })
```

### Analyze Contribution

```python
def analyze_contribution(self, contribution: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze a single contribution for fraud."""
    response = self.session.post(
        f'{self.base_url}/ai/analyze-contribution',
        json=contribution
    )
    response.raise_for_status()
    return response.json()

# Usage
api = PolkaQuadrantAPI()

contribution = {
    'contributorAddress': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'projectId': 'proj_123',
    'amount': 100,
    'timestamp': '2024-01-30T12:00:00Z'
}

result = api.analyze_contribution(contribution)
print(f"Fraud Score: {result['data']['fraudScore']}")
print(f"Risk Level: {result['data']['riskLevel']}")
```

### Analyze Round

```python
def analyze_round(self, round_id: str, contributions: list) -> Dict[str, Any]:
    """Analyze an entire funding round."""
    response = self.session.post(
        f'{self.base_url}/ai/analyze-round',
        json={
            'roundId': round_id,
            'contributions': contributions,
            'threshold': 0.7
        }
    )
    response.raise_for_status()
    return response.json()

# Usage
contributions = [
    {
        'contributorAddress': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        'projectId': 'proj_123',
        'amount': 100
    },
    # ... more contributions
]

result = api.analyze_round('round_123', contributions)
summary = result['data']['summary']
print(f"Total: {summary['total']}, Flagged: {summary['flagged']}")
```

### Get Funding Rounds

```python
def get_funding_rounds(
    self,
    status: str = 'all',
    network: Optional[str] = None,
    limit: int = 50
) -> Dict[str, Any]:
    """Get funding rounds from blockchain."""
    params = {
        'status': status,
        'limit': limit
    }
    if network:
        params['network'] = network
    
    response = self.session.get(
        f'{self.base_url}/blockchain/rounds',
        params=params
    )
    response.raise_for_status()
    return response.json()

# Usage
rounds = api.get_funding_rounds(status='active', network='rococo')
for round in rounds['data']['rounds']:
    print(f"{round['name']}: {round['matchingPoolFormatted']}")
```

### Batch Processing Example

```python
def batch_analyze_contributions(self, contributions: list, batch_size: int = 10):
    """Analyze contributions in batches to respect rate limits."""
    import time
    
    results = []
    for i in range(0, len(contributions), batch_size):
        batch = contributions[i:i + batch_size]
        
        for contribution in batch:
            try:
                result = self.analyze_contribution(contribution)
                results.append(result)
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 429:
                    # Rate limited, wait and retry
                    time.sleep(60)
                    result = self.analyze_contribution(contribution)
                    results.append(result)
                else:
                    raise
        
        # Small delay between batches
        time.sleep(1)
    
    return results

# Usage
contributions = [...]  # Large list of contributions
results = api.batch_analyze_contributions(contributions)
```

---

## 💻 cURL

### Analyze Contribution

```bash
curl -X POST http://localhost:4000/api/v1/ai/analyze-contribution \
  -H "Content-Type: application/json" \
  -d '{
    "contributorAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "projectId": "proj_123",
    "amount": 100,
    "timestamp": "2024-01-30T12:00:00Z"
  }'
```

### Analyze Round

```bash
curl -X POST http://localhost:4000/api/v1/ai/analyze-round \
  -H "Content-Type: application/json" \
  -d '{
    "roundId": "round_123",
    "contributions": [
      {
        "contributorAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "projectId": "proj_123",
        "amount": 100
      }
    ],
    "threshold": 0.7
  }'
```

### Get Risk Report

```bash
curl -X GET "http://localhost:4000/api/v1/ai/risk-report/round_123?format=json&includeDetails=true"
```

### Get Funding Rounds

```bash
curl -X GET "http://localhost:4000/api/v1/blockchain/rounds?status=active&network=rococo&limit=10"
```

### Get Project Details

```bash
curl -X GET "http://localhost:4000/api/v1/blockchain/projects/proj_123?includeContributions=true"
```

### Submit Feedback

```bash
curl -X POST http://localhost:4000/api/v1/feedback/submit \
  -H "Content-Type: application/json" \
  -d '{
    "testerId": "tester_001",
    "testerName": "John Doe",
    "usabilityScore": 4.5,
    "comments": "Great platform!"
  }'
```

### Export Feedback as CSV

```bash
curl -X GET "http://localhost:4000/api/v1/feedback/export?format=csv" \
  -o feedback.csv
```

### Get Metrics

```bash
curl -X GET "http://localhost:4000/api/v1/metrics/overview?period=7d"
```

---

## ⚠️ Error Handling

### JavaScript/TypeScript

```typescript
async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await apiCall();
    return { data };
  } catch (error: any) {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return { error: `Bad Request: ${data.message}` };
        case 404:
          return { error: 'Resource not found' };
        case 429:
          return { error: 'Rate limit exceeded. Please try again later.' };
        case 500:
          return { error: 'Server error. Please try again.' };
        default:
          return { error: data.message || 'Unknown error' };
      }
    } else if (error.request) {
      // Request made but no response
      return { error: 'No response from server. Check your connection.' };
    } else {
      // Error in request setup
      return { error: error.message };
    }
  }
}

// Usage
const { data, error } = await safeApiCall(() =>
  analyzeContribution(contribution)
);

if (error) {
  console.error('Error:', error);
} else {
  console.log('Result:', data);
}
```

### Python

```python
from requests.exceptions import HTTPError, RequestException
import time

def safe_api_call(func, *args, max_retries=3, **kwargs):
    """Safely call API with retry logic."""
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except HTTPError as e:
            if e.response.status_code == 429:
                # Rate limited
                wait_time = 60 * (attempt + 1)
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            elif e.response.status_code >= 500:
                # Server error, retry
                if attempt < max_retries - 1:
                    time.sleep(5)
                    continue
                raise
            else:
                # Client error, don't retry
                raise
        except RequestException as e:
            # Network error
            if attempt < max_retries - 1:
                time.sleep(5)
                continue
            raise
    
    raise Exception(f"Failed after {max_retries} attempts")

# Usage
try:
    result = safe_api_call(api.analyze_contribution, contribution)
    print(result)
except Exception as e:
    print(f"Error: {e}")
```

---

## 🚦 Rate Limiting

### Respecting Rate Limits (JavaScript)

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerMinute: number;
  private interval: number;

  constructor(requestsPerMinute: number = 50) {
    this.requestsPerMinute = requestsPerMinute;
    this.interval = 60000 / requestsPerMinute;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    this.processing = true;

    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      if (fn) {
        await fn();
        await new Promise(resolve => setTimeout(resolve, this.interval));
      }
    }

    this.processing = false;
  }
}

// Usage
const limiter = new RateLimiter(50); // 50 requests per minute

const contributions = [...]; // Array of contributions

const results = await Promise.all(
  contributions.map(contribution =>
    limiter.add(() => analyzeContribution(contribution))
  )
);
```

### Python Rate Limiter

```python
import time
from functools import wraps

class RateLimiter:
    def __init__(self, requests_per_minute=50):
        self.requests_per_minute = requests_per_minute
        self.interval = 60.0 / requests_per_minute
        self.last_request = 0
    
    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - self.last_request
            if elapsed < self.interval:
                time.sleep(self.interval - elapsed)
            
            self.last_request = time.time()
            return func(*args, **kwargs)
        
        return wrapper

# Usage
rate_limiter = RateLimiter(50)

@rate_limiter
def analyze_with_limit(contribution):
    return api.analyze_contribution(contribution)

# Now calls are automatically rate-limited
for contribution in contributions:
    result = analyze_with_limit(contribution)
```

---

## 📚 Complete Integration Example

### Full Application (TypeScript)

```typescript
import axios, { AxiosInstance } from 'axios';

class PolkaQuadrantClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;

  constructor(baseURL: string = 'http://localhost:4000/api/v1') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.rateLimiter = new RateLimiter(50);

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded');
        }
        return Promise.reject(error);
      }
    );
  }

  // Fraud Detection
  async analyzeContribution(contribution: any) {
    return this.rateLimiter.add(async () => {
      const response = await this.client.post(
        '/ai/analyze-contribution',
        contribution
      );
      return response.data;
    });
  }

  async analyzeRound(roundId: string, contributions: any[]) {
    const response = await this.client.post('/ai/analyze-round', {
      roundId,
      contributions,
    });
    return response.data;
  }

  async getRiskReport(roundId: string, format = 'json') {
    const response = await this.client.get(`/ai/risk-report/${roundId}`, {
      params: { format },
    });
    return response.data;
  }

  // Blockchain
  async getFundingRounds(params: any = {}) {
    const response = await this.client.get('/blockchain/rounds', { params });
    return response.data;
  }

  async getProjectDetails(projectId: string) {
    const response = await this.client.get(`/blockchain/projects/${projectId}`);
    return response.data;
  }

  // Feedback
  async submitFeedback(feedback: any) {
    const response = await this.client.post('/feedback/submit', feedback);
    return response.data;
  }

  async getFeedbackStats() {
    const response = await this.client.get('/feedback/stats');
    return response.data;
  }
}

// Usage
const client = new PolkaQuadrantClient();

// Analyze contributions
const analysis = await client.analyzeContribution({
  contributorAddress: '0x742d...',
  amount: 100,
});

// Get funding rounds
const rounds = await client.getFundingRounds({ status: 'active' });

// Submit feedback
await client.submitFeedback({
  testerId: 'tester_001',
  testerName: 'John Doe',
  usabilityScore: 4.5,
});
```

---

**For more examples, see the [API Reference](./API_REFERENCE.md) and [Postman Collection](./postman_collection.json).**
