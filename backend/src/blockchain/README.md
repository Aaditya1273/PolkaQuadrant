# Blockchain Integration Module

Polkadot.js API integration for multi-network blockchain connectivity.

## Overview

This module provides comprehensive blockchain integration for PolkaQuadrant, supporting multiple Polkadot networks with automatic reconnection, connection pooling, and real-time event monitoring.

## Supported Networks

### 1. Local Substrate Node
- **Endpoint**: `ws://127.0.0.1:9944`
- **Use**: Local development and testing
- **Features**: Full pallet access, fast block times

### 2. Rococo Testnet
- **Endpoint**: `wss://rococo-rpc.polkadot.io`
- **Use**: Testnet deployment and validation
- **Features**: Real parachain environment

### 3. Acala Parachain
- **Endpoint**: `wss://acala-rpc.dwellir.com`
- **Use**: Production deployment
- **Features**: DeFi capabilities, stable network

## Architecture

```
MainnetConnector
├── Connection Management
│   ├── Multi-network support
│   ├── Auto-reconnection
│   └── Connection pooling
├── Query Functions
│   ├── Funding rounds
│   ├── Project metadata
│   └── Chain information
├── Event Monitoring
│   ├── Real-time subscriptions
│   ├── Contribution events
│   └── Block updates
└── Pallet Validation
    ├── Compatibility checks
    └── Metadata queries
```

## Files

- **mainnetConnector.ts**: Core blockchain connector (500+ lines)
- **palletInteraction.ts**: Pallet interaction layer (300+ lines)
- **README.md**: This documentation

## Usage

### 1. Connect to a Network

```typescript
import { mainnetConnector } from './blockchain/mainnetConnector';

// Connect to local node
await mainnetConnector.connect('local');

// Connect to Rococo testnet
await mainnetConnector.connect('rococo');

// Connect to Acala parachain
await mainnetConnector.connect('acala');

// Connect to all networks
await mainnetConnector.connectAll();
```

### 2. Switch Networks

```typescript
// Switch to different network
await mainnetConnector.switchNetwork('rococo');

// Get current network
const current = mainnetConnector.getCurrentNetwork();
console.log(current.name); // "Rococo Testnet"
```

### 3. Query Funding Rounds

```typescript
// Get active funding rounds
const rounds = await mainnetConnector.queryActiveFundingRounds();

rounds.forEach(round => {
  console.log(`Round: ${round.name}`);
  console.log(`Status: ${round.status}`);
  console.log(`Projects: ${round.projectCount}`);
  console.log(`Funding: ${round.totalFunding}`);
});
```

### 4. Fetch Project Metadata

```typescript
// Get project details
const project = await mainnetConnector.fetchProjectMetadata('project-1');

if (project) {
  console.log(`Name: ${project.name}`);
  console.log(`Owner: ${project.owner}`);
  console.log(`Contributions: ${project.totalContributions}`);
  console.log(`Contributors: ${project.contributorCount}`);
}
```

### 5. Monitor Events

```typescript
// Monitor contribution events in real-time
const unsubscribe = await mainnetConnector.monitorContributionEvents(
  (event) => {
    console.log('New contribution!');
    console.log(`Round: ${event.roundId}`);
    console.log(`Project: ${event.projectId}`);
    console.log(`Contributor: ${event.contributor}`);
    console.log(`Amount: ${event.amount}`);
    console.log(`Block: ${event.blockNumber}`);
  }
);

// Stop monitoring
unsubscribe();
```

### 6. Validate Pallet

```typescript
// Check if quadratic funding pallet exists
const isCompatible = await mainnetConnector.validatePalletCompatibility(
  'quadraticFunding'
);

if (isCompatible) {
  console.log('✅ Pallet is available');
} else {
  console.log('❌ Pallet not found');
}
```

### 7. Get Chain Info

```typescript
// Get current chain information
const info = await mainnetConnector.getChainInfo();

console.log(`Chain: ${info.chain}`);
console.log(`Version: ${info.version}`);
console.log(`Block: ${info.blockNumber}`);
console.log(`Block Time: ${info.blockTime}ms`);
```

## API Endpoints

### GET /api/v1/blockchain/networks
Get list of available networks.

**Response:**
```json
{
  "success": true,
  "networks": [
    {
      "type": "local",
      "name": "Local Substrate Node",
      "endpoint": "ws://127.0.0.1:9944",
      "connected": true
    }
  ],
  "currentNetwork": {
    "name": "Local Substrate Node",
    "endpoint": "ws://127.0.0.1:9944",
    "type": "local"
  }
}
```

### POST /api/v1/blockchain/connect
Connect to a specific network.

**Request:**
```json
{
  "network": "rococo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connected to rococo",
  "chainInfo": {
    "chain": "Rococo",
    "version": "0.9.42",
    "blockNumber": 1234567,
    "blockTime": 6000
  }
}
```

### POST /api/v1/blockchain/connect-all
Connect to all networks.

**Response:**
```json
{
  "success": true,
  "message": "Connected to 3 network(s)",
  "networks": ["local", "rococo", "acala"]
}
```

### POST /api/v1/blockchain/switch
Switch to a different network.

**Request:**
```json
{
  "network": "acala"
}
```

### GET /api/v1/blockchain/chain-info
Get current chain information.

**Query Parameters:**
- `network` (optional): Specific network to query

**Response:**
```json
{
  "success": true,
  "chainInfo": {
    "chain": "Acala",
    "version": "2.0.0",
    "blockNumber": 987654,
    "blockTime": 12000
  }
}
```

### GET /api/v1/blockchain/funding-rounds
Get active funding rounds.

**Response:**
```json
{
  "success": true,
  "rounds": [
    {
      "id": "round-1",
      "name": "Buenos Aires Art Grant",
      "startBlock": 1000,
      "endBlock": 5000,
      "totalFunding": "50000000000000",
      "projectCount": 12,
      "status": "active"
    }
  ],
  "count": 1
}
```

### GET /api/v1/blockchain/project/:projectId
Get project metadata.

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "project-1",
    "name": "Community Art Initiative",
    "description": "Supporting local artists",
    "owner": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "totalContributions": "5000000000000",
    "contributorCount": 25,
    "createdAt": 1699999999
  }
}
```

### GET /api/v1/blockchain/balance/:address
Get account balance.

**Response:**
```json
{
  "success": true,
  "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "balance": "1000000000000"
}
```

### POST /api/v1/blockchain/validate-pallet
Validate pallet compatibility.

**Request:**
```json
{
  "palletName": "quadraticFunding",
  "network": "local"
}
```

**Response:**
```json
{
  "success": true,
  "palletName": "quadraticFunding",
  "isCompatible": true
}
```

### GET /api/v1/blockchain/block-number
Get current block number.

**Response:**
```json
{
  "success": true,
  "blockNumber": 1234567
}
```

### GET /api/v1/blockchain/status
Get overall blockchain connection status.

**Response:**
```json
{
  "success": true,
  "status": {
    "connected": true,
    "connectedNetworks": ["local", "rococo"],
    "currentNetwork": {
      "name": "Local Substrate Node",
      "endpoint": "ws://127.0.0.1:9944",
      "type": "local"
    },
    "totalNetworks": 3
  }
}
```

## Features

### Connection Management

**Auto-Reconnection:**
- Automatic reconnection on disconnect
- Configurable retry attempts (default: 5)
- Exponential backoff (default: 5s delay)

**Connection Pooling:**
- Maintain connections to multiple networks
- Switch between networks instantly
- Efficient resource management

**Error Handling:**
- Comprehensive error catching
- Graceful degradation
- Detailed error messages

### Event Monitoring

**Real-Time Subscriptions:**
```typescript
// Subscribe to new blocks
api.rpc.chain.subscribeNewHeads((header) => {
  console.log(`New block: ${header.number}`);
});

// Subscribe to events
api.query.system.events((events) => {
  events.forEach((record) => {
    const { event } = record;
    console.log(`Event: ${event.section}.${event.method}`);
  });
});
```

**Contribution Events:**
- Automatic event filtering
- Structured event data
- Callback-based notifications

### Pallet Validation

**Compatibility Checks:**
- Verify pallet existence
- Check method availability
- Validate storage items

**Metadata Queries:**
- Fetch pallet metadata
- List available methods
- Inspect storage structure

## Configuration

### Environment Variables

```bash
# .env
POLKADOT_LOCAL_ENDPOINT=ws://127.0.0.1:9944
POLKADOT_ROCOCO_ENDPOINT=wss://rococo-rpc.polkadot.io
POLKADOT_ACALA_ENDPOINT=wss://acala-rpc.dwellir.com
```

### Custom Network

```typescript
// Add custom network
const customNetwork = {
  name: 'Custom Network',
  endpoint: 'wss://custom-rpc.example.com',
  type: 'custom' as NetworkType,
};

// Connect to custom network
const provider = new WsProvider(customNetwork.endpoint);
const api = await ApiPromise.create({ provider });
```

## Error Handling

### Connection Errors

```typescript
try {
  await mainnetConnector.connect('rococo');
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Connection timeout');
  } else if (error.message.includes('refused')) {
    console.error('Connection refused');
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Query Errors

```typescript
try {
  const rounds = await mainnetConnector.queryActiveFundingRounds();
} catch (error) {
  console.error('Failed to query rounds:', error);
  // Fall back to mock data
  const mockRounds = getMockData();
}
```

## Performance

### Optimization Techniques

1. **Connection Pooling**: Reuse existing connections
2. **Lazy Loading**: Connect only when needed
3. **Caching**: Cache frequently accessed data
4. **Batch Queries**: Combine multiple queries

### Benchmarks

- **Connection Time**: ~2-5 seconds
- **Query Time**: ~100-500ms
- **Event Latency**: ~1-2 seconds
- **Memory Usage**: ~50-100MB per connection

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
# Start local substrate node
./target/release/node-template --dev

# Run integration tests
npm run test:integration
```

### Manual Testing

```bash
# Connect to local node
curl -X POST http://localhost:4000/api/v1/blockchain/connect \
  -H "Content-Type: application/json" \
  -d '{"network": "local"}'

# Get funding rounds
curl http://localhost:4000/api/v1/blockchain/funding-rounds
```

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to network
**Solution:**
1. Check network endpoint is correct
2. Verify network is running
3. Check firewall settings
4. Try different RPC endpoint

### Pallet Not Found

**Problem:** Pallet validation fails
**Solution:**
1. Verify pallet is deployed
2. Check pallet name spelling
3. Ensure correct network
4. Update runtime metadata

### Event Monitoring Stops

**Problem:** Events stop being received
**Solution:**
1. Check WebSocket connection
2. Verify subscription is active
3. Reconnect to network
4. Check event filters

## Best Practices

1. **Always handle errors**: Use try-catch blocks
2. **Disconnect when done**: Free up resources
3. **Use connection pooling**: For multi-network apps
4. **Validate pallets**: Before making calls
5. **Monitor events carefully**: Avoid memory leaks
6. **Cache data**: Reduce network calls
7. **Test on testnet first**: Before mainnet deployment

## Future Enhancements

- [ ] WebSocket server for real-time updates
- [ ] GraphQL API layer
- [ ] Advanced caching strategies
- [ ] Multi-signature support
- [ ] Batch transaction support
- [ ] Historical data queries
- [ ] Network health monitoring

## References

- Polkadot.js API: https://polkadot.js.org/docs/api
- Substrate Docs: https://docs.substrate.io
- Rococo Testnet: https://wiki.polkadot.network/docs/build-pdk
- Acala Network: https://acala.network
