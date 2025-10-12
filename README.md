<div align="center">

# 🎯 PolkaQuadrant

**A Comprehensive Testing Suite for Quadratic Funding on Polkadot**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green.svg)](https://nodejs.org/)
[![Polkadot](https://img.shields.io/badge/Polkadot-API-E6007A.svg)](https://polkadot.js.org/)
[![Tests](https://img.shields.io/badge/Tests-Unit%20%7C%20Functional-brightgreen.svg)]()

*Empowering decentralized funding through rigorous testing and validation*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Testing](#-testing)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**PolkaQuadrant** is a robust testing framework designed specifically for the Quadratic Funding Pallet on Polkadot-based blockchains. It provides comprehensive unit and functional tests to ensure the reliability and security of quadratic funding mechanisms, which are crucial for democratic resource allocation in decentralized ecosystems.

### What is Quadratic Funding?

Quadratic Funding is a mathematically optimal way to fund public goods in a democratic community. It amplifies small contributions and ensures that projects valued by the community receive proportional funding from a matching pool.

### Why PolkaQuadrant?

- **🔒 Security First**: Extensive test coverage ensures your funding rounds are secure
- **⚡ Fast & Efficient**: Optimized test suite for rapid development cycles
- **📊 Comprehensive**: Covers all aspects of the quadratic funding lifecycle
- **🛠️ Developer Friendly**: Clean API and well-documented codebase
- **🔄 CI/CD Ready**: Automated testing with GitHub Actions support

---

## ✨ Features

### Core Functionality

- **Project Management**
  - Create and manage funding projects
  - Project validation and metadata handling
  - Owner-based access control

- **Funding Rounds**
  - Schedule and manage funding rounds
  - Configurable start/end blocks
  - Matching fund pool management

- **Contributions**
  - User contribution tracking
  - Quadratic funding calculations
  - Real-time contribution validation

- **Governance**
  - Sudo-based administrative controls
  - Project approval/cancellation
  - Round finalization and withdrawal

### Testing Capabilities

- **Unit Tests**: Isolated testing of individual functions
  - `createProject` - Project creation validation
  - `fund` - Fund pool management
  - `scheduleRound` - Round scheduling logic
  - `contribute` - Contribution mechanics
  - `approve` - Grant approval process
  - `withdraw` - Fund withdrawal validation
  - `cancel` - Project cancellation
  - `cancelRound` - Round cancellation
  - `finalizeRound` - Round finalization

- **Functional Tests**: End-to-end workflow testing
  - Complete funding round lifecycle
  - Multi-user contribution scenarios
  - Edge case handling

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PolkaQuadrant                        │
│                   Testing Framework                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Polkadot.js API                        │
│              (WebSocket Connection)                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Substrate Node (Local)                     │
│         Quadratic Funding Pallet Runtime                │
└─────────────────────────────────────────────────────────┘
```

### Key Components

- **QuadraticFunding.js**: Main class handling all blockchain interactions
- **config.js**: Network configuration and custom type definitions
- **utils.js**: Helper functions for common test operations
- **extrinsicsTypes.js**: Mapping of extrinsic methods to events
- **constant.js**: Test constants and default values

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14.0.0 or higher
- **npm** or **yarn**: Latest version
- **Rust & Cargo**: For building the Substrate node
- **Git**: For cloning repositories

### System Requirements

- **OS**: Linux, macOS, or Windows (WSL recommended)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 10GB free space

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/PolkaQuadrant.git
cd PolkaQuadrant
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up the Substrate Node

Clone and build the quadratic funding pallet:

```bash
git clone https://github.com/OAK-Foundation/quadratic-funding-pallet
cd quadratic-funding-pallet
cargo build --release
```

---

## 🎬 Quick Start

### 1. Start Local Blockchain Node

```bash
cd quadratic-funding-pallet
./target/release/node-template --dev --tmp
```

The node will start on `ws://127.0.0.1:9944` by default.

### 2. Run All Tests

```bash
npm test
```

### 3. Run Specific Test Suites

```bash
# Unit tests only
npm run "test unit"

# Functional tests only
npm run "test functional"
```

---

## 🧪 Testing

### Test Structure

```
test/
├── unit/                    # Unit tests
│   ├── createProject.test.js
│   ├── fund.test.js
│   ├── scheduleRound.test.js
│   ├── contribute.test.js
│   ├── approve.test.js
│   ├── withdraw.test.js
│   ├── cancel.test.js
│   ├── cancelRound.test.js
│   └── finalizeRound.test.js
├── functional/              # Functional tests
│   ├── approve.test.js
│   ├── cancel.test.js
│   ├── cancelRound.test.js
│   ├── contribute.test.js
│   ├── finalizeRound.test.js
│   ├── scheduleRound.test.js
│   └── withdraw.test.js
├── QuadraticFunding.js      # Main test class
├── config.js                # Configuration
├── utils.js                 # Utility functions
├── constant.js              # Constants
└── extrinsicsTypes.js       # Extrinsic definitions
```

### Running Tests with Mocha

```bash
# Run all tests with verbose output
npm test -- --reporter spec

# Run specific test file
npx mocha test/unit/createProject.test.js

# Run with custom timeout
npm test -- --timeout 60000
```

### Test Coverage

The test suite covers:
- ✅ Project creation and validation
- ✅ Fund pool management
- ✅ Round scheduling and lifecycle
- ✅ User contributions
- ✅ Grant approval and withdrawal
- ✅ Cancellation mechanisms
- ✅ Error handling and edge cases

---

## 📚 API Reference

### QuadraticFunding Class

#### Initialization

```javascript
const QuadraticFunding = require('./test/QuadraticFunding');
const qf = new QuadraticFunding();
await qf.init();
```

#### Core Methods

##### `createProject(params)`
Create a new project for funding.

```javascript
const extrinsic = await qf.createProject({
  name: 'My Project',
  logo: 'https://example.com/logo.png',
  description: 'Project description',
  website: 'https://example.com'
});
```

##### `fund(params)`
Add funds to the matching pool.

```javascript
const extrinsic = await qf.fund({
  fundBalance: 100000000000000 // 100 units
});
```

##### `scheduleRound(params)`
Schedule a new funding round (requires sudo).

```javascript
const extrinsic = await qf.scheduleRound({
  start: 100,              // Start block
  end: 200,                // End block
  matchingFund: 50000,     // Matching fund amount
  projectIndexes: [0, 1, 2] // Projects in this round
});
```

##### `contribute(params)`
Contribute to a project in an active round.

```javascript
const extrinsic = await qf.contribute({
  projectIndex: 0,
  value: 10000000000000 // 10 units
});
```

##### `finalizeRound(params)`
Finalize a completed round (requires sudo).

```javascript
const extrinsic = await qf.finalizeRound({
  roundIndex: 0
});
```

##### `approve(params)`
Approve a grant for withdrawal (requires sudo).

```javascript
const extrinsic = await qf.approve({
  roundIndex: 0,
  projectIndex: 0
});
```

##### `withdraw(params)`
Withdraw funds from an approved grant.

```javascript
const extrinsic = await qf.withdraw({
  roundIndex: 0,
  projectIndex: 0
});
```

##### `cancel(params)`
Cancel a project in a round (requires sudo).

```javascript
const extrinsic = await qf.cancel({
  roundIndex: 0,
  projectIndex: 0
});
```

##### `cancelRound(params)`
Cancel a scheduled round (requires sudo).

```javascript
const extrinsic = await qf.cancelRound({
  roundIndex: 0
});
```

#### Storage Queries

```javascript
// Get project count
const count = await qf.getProjectCount();

// Get project info
const project = await qf.getProjectInfo(projectIndex);

// Get round count
const roundCount = await qf.getGrantRoundCount();

// Get round info
const round = await qf.getGrantRoundInfo(roundIndex);

// Get current block number
const blockNumber = await qf.getCurrentBlockNumber();
```

---

## 📁 Project Structure

```
PolkaQuadrant/
├── .github/
│   └── dependabot.yml       # Dependency updates automation
├── asset/                   # Documentation assets
├── test/
│   ├── unit/                # Unit test suites
│   ├── functional/          # Functional test suites
│   ├── QuadraticFunding.js  # Main testing class
│   ├── config.js            # Network configuration
│   ├── constant.js          # Test constants
│   ├── extrinsicsTypes.js   # Extrinsic type definitions
│   └── utils.js             # Helper utilities
├── .eslintrc.js             # ESLint configuration
├── .gitignore               # Git ignore rules
├── LICENSE                  # Apache 2.0 License
├── package.json             # Project dependencies
├── package-lock.json        # Locked dependencies
└── README.md                # This file
```

---

## ⚙️ Configuration

### Network Configuration

Edit `test/config.js` to customize your setup:

```javascript
module.exports = {
  endpoint: 'ws://127.0.0.1:9944', // WebSocket endpoint
  types: {
    // Custom type definitions
    ProjectIndex: 'u32',
    RoundIndex: 'u32',
    // ... more types
  }
};
```

### Test Constants

Modify `test/constant.js` for test parameters:

```javascript
module.exports = {
  fundAmount: 100000000000000,    // 100 units
  matchingFund: 0,
  roundDuration: 30,              // blocks
  confirmBlocks: 12,
  value: 10000000000000,          // 10 units
};
```

### Polkadot.js Apps Configuration

For manual testing via Polkadot.js Apps:

1. Open [Polkadot.js Apps](https://polkadot.js.org/apps/)
2. Navigate to **Settings** → **Developer**
3. Paste the custom types from `test/config.js`
4. Click **Save**

```json
{
  "ProjectIndex": "u32",
  "ProjectOf": "Project",
  "RoundIndex": "u32",
  "RoundOf": "Round",
  "Round": {
    "start": "BlockNumber",
    "end": "BlockNumber",
    "matching_fund": "Balance",
    "grants": "Vec<Grant>",
    "is_canceled": "bool",
    "is_finalized": "bool"
  },
  "Grant": {
    "project_index": "ProjectIndex",
    "contributions": "Vec<Contribution>",
    "is_approved": "bool",
    "is_canceled": "bool",
    "is_withdrawn": "bool",
    "withdrawal_expiration": "BlockNumber",
    "matching_fund": "Balance"
  },
  "Contribution": {
    "account_id": "AccountId",
    "value": "Balance"
  },
  "Project": {
    "name": "Vec<u8>",
    "logo": "Vec<u8>",
    "description": "Vec<u8>",
    "website": "Vec<u8>",
    "owner": "AccountId"
  }
}
```

---

## 🔧 Development

### Code Style

This project uses ESLint with Airbnb base configuration:

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Adding New Tests

1. Create a new test file in `test/unit/` or `test/functional/`
2. Import required dependencies:
   ```javascript
   const { assert } = require('chai');
   const QuadraticFunding = require('../QuadraticFunding');
   const { yourHelper } = require('../utils');
   ```
3. Write your test suite:
   ```javascript
   describe('Your Test Suite', async () => {
     const qf = new QuadraticFunding();
     
     before(async () => {
       await qf.init();
     });
     
     it('should do something', async () => {
       // Your test logic
     });
   });
   ```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Ensure all tests pass before submitting

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: `Cannot connect to WebSocket endpoint`
```bash
# Solution: Ensure the Substrate node is running
./target/release/node-template --dev --tmp
```

**Issue**: `Test timeout`
```bash
# Solution: Increase timeout in package.json or command line
npm test -- --timeout 60000
```

**Issue**: `Type definitions not found`
```bash
# Solution: Verify custom types in config.js match your pallet
```

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

```
Copyright 2013-2018 Docker, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## 🙏 Acknowledgments

- **OAK Foundation** - For the quadratic funding pallet implementation
- **Polkadot.js Team** - For the excellent API library
- **Substrate Community** - For the robust blockchain framework
- **Contributors** - Thank you to all who have contributed to this project

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/PolkaQuadrant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/PolkaQuadrant/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/PolkaQuadrant/wiki)

---

## 🗺️ Roadmap

- [ ] Integration with mainnet/testnet
- [ ] Enhanced reporting and analytics
- [ ] Web-based test runner UI
- [ ] Performance benchmarking suite
- [ ] Multi-chain support
- [ ] Automated CI/CD pipeline
- [ ] Docker containerization

---

<div align="center">

**Made with ❤️ for the Polkadot Ecosystem**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/yourusername/PolkaQuadrant/issues) · [Request Feature](https://github.com/yourusername/PolkaQuadrant/issues) · [Documentation](https://github.com/yourusername/PolkaQuadrant/wiki)

</div>
