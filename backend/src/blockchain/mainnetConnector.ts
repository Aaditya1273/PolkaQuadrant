import { ApiPromise, WsProvider } from '@polkadot/api';
import { EventRecord } from '@polkadot/types/interfaces';

/**
 * Polkadot Mainnet Connector
 * Multi-network blockchain integration for PolkaQuadrant
 */

export type NetworkType = 'rococo' | 'acala' | 'local';

export interface NetworkConfig {
  name: string;
  endpoint: string;
  type: NetworkType;
}

export interface FundingRound {
  id: string;
  name: string;
  startBlock: number;
  endBlock: number;
  totalFunding: string;
  projectCount: number;
  status: 'active' | 'ended' | 'pending';
}

export interface ProjectMetadata {
  id: string;
  name: string;
  description: string;
  owner: string;
  totalContributions: string;
  contributorCount: number;
  createdAt: number;
}

export interface ContributionEvent {
  roundId: string;
  projectId: string;
  contributor: string;
  amount: string;
  blockNumber: number;
  timestamp: number;
  transactionHash: string;
}

export class MainnetConnector {
  private apis: Map<NetworkType, ApiPromise> = new Map();
  private providers: Map<NetworkType, WsProvider> = new Map();
  private currentNetwork: NetworkType = 'local';
  private reconnectAttempts: Map<NetworkType, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000;

  private networks: Map<NetworkType, NetworkConfig> = new Map([
    ['rococo', {
      name: 'Rococo Testnet',
      endpoint: 'wss://rococo-rpc.polkadot.io',
      type: 'rococo',
    }],
    ['acala', {
      name: 'Acala Parachain',
      endpoint: 'wss://acala-rpc.dwellir.com',
      type: 'acala',
    }],
    ['local', {
      name: 'Local Substrate Node',
      endpoint: 'ws://127.0.0.1:9944',
      type: 'local',
    }],
  ]);

  /**
   * Initialize connection to a specific network
   */
  async connect(network: NetworkType = 'local'): Promise<ApiPromise> {
    try {
      const config = this.networks.get(network);
      if (!config) {
        throw new Error(`Unknown network: ${network}`);
      }

      console.log(`🔗 Connecting to ${config.name}...`);

      // Create WebSocket provider
      const provider = new WsProvider(config.endpoint, 1000);
      this.providers.set(network, provider);

      // Setup provider event handlers
      provider.on('connected', () => {
        console.log(`✅ Connected to ${config.name}`);
        this.reconnectAttempts.set(network, 0);
      });

      provider.on('disconnected', () => {
        console.log(`❌ Disconnected from ${config.name}`);
        this.handleDisconnection(network);
      });

      provider.on('error', (error) => {
        console.error(`⚠️  Error on ${config.name}:`, error);
      });

      // Create API instance
      const api = await ApiPromise.create({ provider });

      // Wait for API to be ready
      await api.isReady;

      this.apis.set(network, api);
      this.currentNetwork = network;

      console.log(`✅ API ready for ${config.name}`);
      console.log(`   Chain: ${(await api.rpc.system.chain()).toString()}`);
      console.log(`   Version: ${(await api.rpc.system.version()).toString()}`);

      return api;
    } catch (error) {
      console.error(`❌ Failed to connect to ${network}:`, error);
      throw error;
    }
  }

  /**
   * Connect to all networks (connection pooling)
   */
  async connectAll(): Promise<void> {
    const networks: NetworkType[] = ['local', 'rococo', 'acala'];
    const promises = networks.map(async (network) => {
      try {
        await this.connect(network);
      } catch (error) {
        console.warn(`Failed to connect to ${network}, continuing...`);
      }
    });

    await Promise.allSettled(promises);
    console.log(`✅ Connected to ${this.apis.size} network(s)`);
  }

  /**
   * Handle disconnection and attempt reconnection
   */
  private async handleDisconnection(network: NetworkType): Promise<void> {
    const attempts = this.reconnectAttempts.get(network) || 0;

    if (attempts >= this.maxReconnectAttempts) {
      console.error(`❌ Max reconnection attempts reached for ${network}`);
      return;
    }

    this.reconnectAttempts.set(network, attempts + 1);

    console.log(
      `🔄 Attempting to reconnect to ${network} (${attempts + 1}/${this.maxReconnectAttempts})...`
    );

    setTimeout(async () => {
      try {
        await this.connect(network);
      } catch (error) {
        console.error(`Failed to reconnect to ${network}:`, error);
      }
    }, this.reconnectDelay);
  }

  /**
   * Switch to a different network
   */
  async switchNetwork(network: NetworkType): Promise<ApiPromise> {
    if (!this.apis.has(network)) {
      return await this.connect(network);
    }

    this.currentNetwork = network;
    const api = this.apis.get(network)!;

    console.log(`🔄 Switched to ${this.networks.get(network)?.name}`);
    return api;
  }

  /**
   * Get current API instance
   */
  getApi(network?: NetworkType): ApiPromise {
    const targetNetwork = network || this.currentNetwork;
    const api = this.apis.get(targetNetwork);

    if (!api) {
      throw new Error(`Not connected to ${targetNetwork}. Call connect() first.`);
    }

    return api;
  }

  /**
   * Get current network info
   */
  getCurrentNetwork(): NetworkConfig | undefined {
    return this.networks.get(this.currentNetwork);
  }

  /**
   * Get all connected networks
   */
  getConnectedNetworks(): NetworkType[] {
    return Array.from(this.apis.keys());
  }

  /**
   * Check if connected to a network
   */
  isConnected(network?: NetworkType): boolean {
    const targetNetwork = network || this.currentNetwork;
    return this.apis.has(targetNetwork);
  }

  /**
   * Validate pallet compatibility
   */
  async validatePalletCompatibility(
    palletName: string,
    network?: NetworkType
  ): Promise<boolean> {
    try {
      const api = this.getApi(network);
      const metadata = await api.rpc.state.getMetadata();
      const pallets = metadata.asLatest.pallets;

      const hasPallet = pallets.some(
        (pallet) => pallet.name.toString().toLowerCase() === palletName.toLowerCase()
      );

      if (hasPallet) {
        console.log(`✅ Pallet '${palletName}' is available`);
      } else {
        console.warn(`⚠️  Pallet '${palletName}' not found`);
      }

      return hasPallet;
    } catch (error) {
      console.error(`Error validating pallet ${palletName}:`, error);
      return false;
    }
  }

  /**
   * Query active funding rounds
   */
  async queryActiveFundingRounds(network?: NetworkType): Promise<FundingRound[]> {
    try {
      const api = this.getApi(network);

      // Check if quadratic funding pallet exists
      const hasPallet = await this.validatePalletCompatibility('quadraticFunding');

      if (!hasPallet) {
        console.warn('Quadratic funding pallet not found, returning mock data');
        return this.getMockFundingRounds();
      }

      // Query storage for active rounds
      // Note: Adjust based on your actual pallet structure
      const rounds: FundingRound[] = [];

      // Example query (adjust to your pallet's storage structure)
      try {
        const roundCount = await api.query.quadraticFunding?.roundCount?.();
        if (roundCount) {
          const count = Number(roundCount.toString());

          for (let i = 0; i < count; i++) {
            const round = await api.query.quadraticFunding?.rounds?.(i);
            if (round && !round.isEmpty) {
              const roundData = round.toJSON() as any;
              rounds.push({
                id: `round-${i}`,
                name: roundData.name || `Round ${i}`,
                startBlock: roundData.startBlock || 0,
                endBlock: roundData.endBlock || 0,
                totalFunding: roundData.totalFunding || '0',
                projectCount: roundData.projectCount || 0,
                status: this.determineRoundStatus(
                  roundData.startBlock,
                  roundData.endBlock,
                  await api.query.system.number()
                ),
              });
            }
          }
        }
      } catch (error) {
        console.warn('Error querying rounds, using mock data:', error);
        return this.getMockFundingRounds();
      }

      return rounds;
    } catch (error) {
      console.error('Error querying funding rounds:', error);
      throw error;
    }
  }

  /**
   * Fetch project metadata
   */
  async fetchProjectMetadata(
    projectId: string,
    network?: NetworkType
  ): Promise<ProjectMetadata | null> {
    try {
      const api = this.getApi(network);

      const hasPallet = await this.validatePalletCompatibility('quadraticFunding');

      if (!hasPallet) {
        console.warn('Quadratic funding pallet not found, returning mock data');
        return this.getMockProjectMetadata(projectId);
      }

      // Query project storage
      try {
        const project = await api.query.quadraticFunding?.projects?.(projectId);

        if (!project || project.isEmpty) {
          return null;
        }

        const projectData = project.toJSON() as any;

        return {
          id: projectId,
          name: projectData.name || 'Unknown Project',
          description: projectData.description || '',
          owner: projectData.owner || '',
          totalContributions: projectData.totalContributions || '0',
          contributorCount: projectData.contributorCount || 0,
          createdAt: projectData.createdAt || 0,
        };
      } catch (error) {
        console.warn('Error querying project, using mock data:', error);
        return this.getMockProjectMetadata(projectId);
      }
    } catch (error) {
      console.error('Error fetching project metadata:', error);
      throw error;
    }
  }

  /**
   * Monitor contribution events in real-time
   */
  async monitorContributionEvents(
    callback: (event: ContributionEvent) => void,
    network?: NetworkType
  ): Promise<() => void> {
    try {
      const api = this.getApi(network);

      console.log('👀 Monitoring contribution events...');

      // Subscribe to new blocks
      const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
        const blockNumber = header.number.toNumber();
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);

        // Get events for this block
        const events = await api.query.system.events.at(blockHash);

        // Filter for contribution events
        (events as any).forEach((record: EventRecord) => {
          const { event } = record;

          // Check if this is a contribution event
          if (
            event.section === 'quadraticFunding' &&
            event.method === 'ContributionMade'
          ) {
            const [roundId, projectId, contributor, amount] = event.data;

            const contributionEvent: ContributionEvent = {
              roundId: roundId.toString(),
              projectId: projectId.toString(),
              contributor: contributor.toString(),
              amount: amount.toString(),
              blockNumber,
              timestamp: Date.now(),
              transactionHash: blockHash.toString(),
            };

            callback(contributionEvent);
          }
        });
      });

      // Return unsubscribe function
      return () => {
        unsubscribe();
        console.log('✅ Stopped monitoring contribution events');
      };
    } catch (error) {
      console.error('Error monitoring contribution events:', error);
      throw error;
    }
  }

  /**
   * Get current block number
   */
  async getCurrentBlock(network?: NetworkType): Promise<number> {
    const api = this.getApi(network);
    const header = await api.rpc.chain.getHeader();
    return header.number.toNumber();
  }

  /**
   * Get chain info
   */
  async getChainInfo(network?: NetworkType): Promise<{
    chain: string;
    version: string;
    blockNumber: number;
    blockTime: number;
  }> {
    const api = this.getApi(network);

    const [chain, version, header] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.version(),
      api.rpc.chain.getHeader(),
    ]);

    return {
      chain: chain.toString(),
      version: version.toString(),
      blockNumber: header.number.toNumber(),
      blockTime: 6000, // Default 6s, adjust based on chain
    };
  }

  /**
   * Disconnect from a network
   */
  async disconnect(network?: NetworkType): Promise<void> {
    const targetNetwork = network || this.currentNetwork;
    const api = this.apis.get(targetNetwork);
    const provider = this.providers.get(targetNetwork);

    if (api) {
      await api.disconnect();
      this.apis.delete(targetNetwork);
    }

    if (provider) {
      await provider.disconnect();
      this.providers.delete(targetNetwork);
    }

    console.log(`✅ Disconnected from ${this.networks.get(targetNetwork)?.name}`);
  }

  /**
   * Disconnect from all networks
   */
  async disconnectAll(): Promise<void> {
    const networks = Array.from(this.apis.keys());
    await Promise.all(networks.map((network) => this.disconnect(network)));
    console.log('✅ Disconnected from all networks');
  }

  /**
   * Helper: Determine round status
   */
  private determineRoundStatus(
    startBlock: number,
    endBlock: number,
    currentBlock: any
  ): 'active' | 'ended' | 'pending' {
    const current = currentBlock.toNumber();

    if (current < startBlock) return 'pending';
    if (current > endBlock) return 'ended';
    return 'active';
  }

  /**
   * Helper: Get mock funding rounds (for testing)
   */
  private getMockFundingRounds(): FundingRound[] {
    return [
      {
        id: 'round-1',
        name: 'Buenos Aires Art Grant',
        startBlock: 1000,
        endBlock: 5000,
        totalFunding: '50000000000000',
        projectCount: 12,
        status: 'active',
      },
      {
        id: 'round-2',
        name: 'LATAM Public Goods',
        startBlock: 5000,
        endBlock: 10000,
        totalFunding: '75000000000000',
        projectCount: 18,
        status: 'pending',
      },
    ];
  }

  /**
   * Helper: Get mock project metadata (for testing)
   */
  private getMockProjectMetadata(projectId: string): ProjectMetadata {
    return {
      id: projectId,
      name: `Project ${projectId}`,
      description: 'A community-driven public goods project',
      owner: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      totalContributions: '5000000000000',
      contributorCount: 25,
      createdAt: Date.now() - 86400000 * 30, // 30 days ago
    };
  }
}

// Export singleton instance
export const mainnetConnector = new MainnetConnector();
