# PolkaQuadrant Scripts

Automation scripts and simulations for testing and deployment.

## Structure

```
scripts/
├── simulations/      # LATAM funding simulations
├── deployment/       # Deployment automation
├── utils/           # Helper utilities
└── package.json     # Dependencies
```

## Available Scripts

### Simulations

Run realistic LATAM funding round simulations:

```bash
# Buenos Aires Art Grant
npm run simulate:buenos-aires

# All simulations
npm run simulate:all
```

### Deployment

```bash
# Deploy to local node
npm run deploy:local
```

### Data Generation

```bash
# Generate synthetic training data
npm run generate:data
```

## Simulations

### Buenos Aires Art Grant
- 100 realistic contributions
- 10 projects
- 12% Sybil attack injection
- AI detection validation

### Mexico City Tech Commons
- 150 contributions
- 15 projects
- Community-focused funding

### São Paulo Social Impact
- 200 contributions
- 20 projects
- Social good initiatives

## Output

Simulations generate JSON reports with:
- Contribution patterns
- AI detection results
- Funding distribution (before/after)
- Metrics and analytics

Reports saved to: `./output/simulations/`

## Usage

1. Install dependencies:
```bash
npm install
```

2. Run a simulation:
```bash
npm run simulate:buenos-aires
```

3. View results in `./output/simulations/`

## Custom Simulations

Create new simulations in `simulations/` directory following the template pattern.
