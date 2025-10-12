# Contracts Directory

This directory contains Substrate pallet integration files and runtime configurations for the Quadratic Funding pallet.

## Structure

```
contracts/
├── pallets/          # Custom Substrate pallets
├── runtime/          # Runtime configuration
└── README.md         # This file
```

## Integration with Quadratic Funding Pallet

The main pallet is maintained in the separate repository:
https://github.com/OAK-Foundation/quadratic-funding-pallet

This directory contains:
- Custom type definitions
- Runtime integration code
- Deployment scripts
- Testing configurations

## Usage

1. Clone the quadratic funding pallet:
```bash
git clone https://github.com/OAK-Foundation/quadratic-funding-pallet
```

2. Build the pallet:
```bash
cd quadratic-funding-pallet
cargo build --release
```

3. Start local node:
```bash
./target/release/node-template --dev --tmp
```

## Custom Types

See `../test/config.js` for the custom type definitions used by Polkadot.js API.
