import { Router, Request, Response } from 'express';
import { mainnetConnector, NetworkType } from '../blockchain/mainnetConnector';
import { palletInteraction } from '../blockchain/palletInteraction';

const router = Router();

/**
 * GET /api/v1/blockchain/networks
 * Get list of available networks
 */
router.get('/networks', (_req: Request, res: Response) => {
  try {
    const networks = [
      {
        type: 'local',
        name: 'Local Substrate Node',
        endpoint: 'ws://127.0.0.1:9944',
        connected: mainnetConnector.isConnected('local'),
      },
      {
        type: 'rococo',
        name: 'Rococo Testnet',
        endpoint: 'wss://rococo-rpc.polkadot.io',
        connected: mainnetConnector.isConnected('rococo'),
      },
      {
        type: 'acala',
        name: 'Acala Parachain',
        endpoint: 'wss://acala-rpc.dwellir.com',
        connected: mainnetConnector.isConnected('acala'),
      },
    ];

    return res.json({
      success: true,
      networks,
      currentNetwork: mainnetConnector.getCurrentNetwork(),
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to get networks',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/blockchain/connect
 * Connect to a specific network
 */
router.post('/connect', async (req: Request, res: Response) => {
  try {
    const { network } = req.body;

    if (!network || !['local', 'rococo', 'acala'].includes(network)) {
      return res.status(400).json({
        error: 'Invalid network',
        message: 'Network must be one of: local, rococo, acala',
      });
    }

    await mainnetConnector.connect(network as NetworkType);
    const chainInfo = await mainnetConnector.getChainInfo(network);

    return res.json({
      success: true,
      message: `Connected to ${network}`,
      chainInfo,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Connection failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/blockchain/connect-all
 * Connect to all networks
 */
router.post('/connect-all', async (_req: Request, res: Response) => {
  try {
    await mainnetConnector.connectAll();

    const connectedNetworks = mainnetConnector.getConnectedNetworks();

    return res.json({
      success: true,
      message: `Connected to ${connectedNetworks.length} network(s)`,
      networks: connectedNetworks,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Connection failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/blockchain/switch
 * Switch to a different network
 */
router.post('/switch', async (req: Request, res: Response) => {
  try {
    const { network } = req.body;

    if (!network || !['local', 'rococo', 'acala'].includes(network)) {
      return res.status(400).json({
        error: 'Invalid network',
        message: 'Network must be one of: local, rococo, acala',
      });
    }

    await mainnetConnector.switchNetwork(network as NetworkType);
    const chainInfo = await mainnetConnector.getChainInfo(network);

    return res.json({
      success: true,
      message: `Switched to ${network}`,
      chainInfo,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Switch failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/blockchain/chain-info
 * Get current chain information
 */
router.get('/chain-info', async (req: Request, res: Response) => {
  try {
    const network = req.query.network as NetworkType | undefined;
    const chainInfo = await mainnetConnector.getChainInfo(network);

    return res.json({
      success: true,
      chainInfo,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to get chain info',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/blockchain/funding-rounds
 * Get active funding rounds
 */
router.get('/funding-rounds', async (req: Request, res: Response) => {
  try {
    const network = req.query.network as NetworkType | undefined;
    const rounds = await mainnetConnector.queryActiveFundingRounds(network);

    return res.json({
      success: true,
      rounds,
      count: rounds.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to get funding rounds',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/blockchain/project/:projectId
 * Get project metadata
 */
router.get('/project/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const network = req.query.network as NetworkType | undefined;

    const project = await mainnetConnector.fetchProjectMetadata(projectId, network);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: `Project ${projectId} does not exist`,
      });
    }

    return res.json({
      success: true,
      project,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to get project',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/blockchain/balance/:address
 * Get account balance
 */
router.get('/balance/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const network = req.query.network as NetworkType | undefined;

    const balance = await palletInteraction.getBalance(address, network);

    return res.json({
      success: true,
      address,
      balance,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to get balance',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/blockchain/validate-pallet
 * Validate pallet compatibility
 */
router.post('/validate-pallet', async (req: Request, res: Response) => {
  try {
    const { palletName, network } = req.body;

    if (!palletName) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'palletName is required',
      });
    }

    const isCompatible = await mainnetConnector.validatePalletCompatibility(
      palletName,
      network
    );

    return res.json({
      success: true,
      palletName,
      isCompatible,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Validation failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/blockchain/block-number
 * Get current block number
 */
router.get('/block-number', async (req: Request, res: Response) => {
  try {
    const network = req.query.network as NetworkType | undefined;
    const blockNumber = await mainnetConnector.getCurrentBlock(network);

    return res.json({
      success: true,
      blockNumber,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to get block number',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/blockchain/monitor-events
 * Start monitoring contribution events
 */
router.post('/monitor-events', async (req: Request, res: Response) => {
  try {
    const { network: _network } = req.body;

    // This would typically use WebSocket to stream events
    // For now, return success message
    return res.json({
      success: true,
      message: 'Event monitoring started',
      note: 'Use WebSocket connection for real-time events',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to start monitoring',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/blockchain/status
 * Get overall blockchain connection status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const connectedNetworks = mainnetConnector.getConnectedNetworks();
    const currentNetwork = mainnetConnector.getCurrentNetwork();

    const status = {
      connected: connectedNetworks.length > 0,
      connectedNetworks,
      currentNetwork,
      totalNetworks: 3,
    };

    return res.json({
      success: true,
      status,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to get status',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/blockchain/disconnect
 * Disconnect from a network
 */
router.post('/disconnect', async (req: Request, res: Response) => {
  try {
    const { network } = req.body;

    if (network && !['local', 'rococo', 'acala'].includes(network)) {
      return res.status(400).json({
        error: 'Invalid network',
        message: 'Network must be one of: local, rococo, acala',
      });
    }

    if (network) {
      await mainnetConnector.disconnect(network as NetworkType);
    } else {
      await mainnetConnector.disconnectAll();
    }

    return res.json({
      success: true,
      message: network ? `Disconnected from ${network}` : 'Disconnected from all networks',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Disconnect failed',
      message: error.message,
    });
  }
});

export default router;
