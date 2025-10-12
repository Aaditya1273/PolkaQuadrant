import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { mainnetConnector, NetworkType } from './mainnetConnector';

/**
 * Pallet Interaction Layer
 * High-level functions for interacting with Quadratic Funding pallet
 */

export interface CreateProjectParams {
  name: string;
  description: string;
  metadata?: string;
}

export interface ContributeParams {
  roundId: string;
  projectId: string;
  amount: string;
}

export interface TransactionResult {
  success: boolean;
  blockHash?: string;
  blockNumber?: number;
  transactionHash?: string;
  error?: string;
}

export class PalletInteraction {
  private keyring: Keyring;

  constructor() {
    this.keyring = new Keyring({ type: 'sr25519' });
  }

  /**
   * Create a new project in a funding round
   */
  async createProject(
    params: CreateProjectParams,
    signer: KeyringPair,
    network?: NetworkType
  ): Promise<TransactionResult> {
    try {
      const api = mainnetConnector.getApi(network);

      console.log('📝 Creating project:', params.name);

      // Check if pallet exists
      const hasPallet = await mainnetConnector.validatePalletCompatibility('quadraticFunding');
      if (!hasPallet) {
        return {
          success: false,
          error: 'Quadratic funding pallet not available on this network',
        };
      }

      // Create transaction
      const tx = api.tx.quadraticFunding.createProject(
        params.name,
        params.description,
        params.metadata || ''
      );

      // Sign and send transaction
      return await this.signAndSend(tx, signer, api);
    } catch (error: any) {
      console.error('Error creating project:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Contribute to a project
   */
  async contribute(
    params: ContributeParams,
    signer: KeyringPair,
    network?: NetworkType
  ): Promise<TransactionResult> {
    try {
      const api = mainnetConnector.getApi(network);

      console.log(`💰 Contributing ${params.amount} to project ${params.projectId}`);

      const hasPallet = await mainnetConnector.validatePalletCompatibility('quadraticFunding');
      if (!hasPallet) {
        return {
          success: false,
          error: 'Quadratic funding pallet not available on this network',
        };
      }

      // Create transaction
      const tx = api.tx.quadraticFunding.contribute(
        params.roundId,
        params.projectId,
        params.amount
      );

      // Sign and send transaction
      return await this.signAndSend(tx, signer, api);
    } catch (error: any) {
      console.error('Error contributing:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Start a new funding round (admin only)
   */
  async startFundingRound(
    name: string,
    startBlock: number,
    endBlock: number,
    signer: KeyringPair,
    network?: NetworkType
  ): Promise<TransactionResult> {
    try {
      const api = mainnetConnector.getApi(network);

      console.log('🚀 Starting funding round:', name);

      const hasPallet = await mainnetConnector.validatePalletCompatibility('quadraticFunding');
      if (!hasPallet) {
        return {
          success: false,
          error: 'Quadratic funding pallet not available on this network',
        };
      }

      const tx = api.tx.quadraticFunding.startRound(name, startBlock, endBlock);

      return await this.signAndSend(tx, signer, api);
    } catch (error: any) {
      console.error('Error starting funding round:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Finalize a funding round (admin only)
   */
  async finalizeFundingRound(
    roundId: string,
    signer: KeyringPair,
    network?: NetworkType
  ): Promise<TransactionResult> {
    try {
      const api = mainnetConnector.getApi(network);

      console.log('🏁 Finalizing funding round:', roundId);

      const hasPallet = await mainnetConnector.validatePalletCompatibility('quadraticFunding');
      if (!hasPallet) {
        return {
          success: false,
          error: 'Quadratic funding pallet not available on this network',
        };
      }

      const tx = api.tx.quadraticFunding.finalizeRound(roundId);

      return await this.signAndSend(tx, signer, api);
    } catch (error: any) {
      console.error('Error finalizing funding round:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address: string, network?: NetworkType): Promise<string> {
    try {
      const api = mainnetConnector.getApi(network);
      const { data: balance } = await api.query.system.account(address);
      return balance.free.toString();
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  /**
   * Transfer tokens
   */
  async transfer(
    to: string,
    amount: string,
    signer: KeyringPair,
    network?: NetworkType
  ): Promise<TransactionResult> {
    try {
      const api = mainnetConnector.getApi(network);

      console.log(`💸 Transferring ${amount} to ${to}`);

      const tx = api.tx.balances.transfer(to, amount);

      return await this.signAndSend(tx, signer, api);
    } catch (error: any) {
      console.error('Error transferring:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create account from mnemonic
   */
  createAccountFromMnemonic(mnemonic: string): KeyringPair {
    return this.keyring.addFromMnemonic(mnemonic);
  }

  /**
   * Create account from seed
   */
  createAccountFromSeed(seed: string): KeyringPair {
    return this.keyring.addFromUri(seed);
  }

  /**
   * Generate new account
   */
  generateAccount(): { pair: KeyringPair; mnemonic: string } {
    const mnemonic = require('@polkadot/util-crypto').mnemonicGenerate();
    const pair = this.keyring.addFromMnemonic(mnemonic);
    return { pair, mnemonic };
  }

  /**
   * Helper: Sign and send transaction
   */
  private async signAndSend(
    tx: any,
    signer: KeyringPair,
    api: ApiPromise
  ): Promise<TransactionResult> {
    return new Promise((resolve) => {
      tx.signAndSend(signer, ({ status, events, dispatchError }: any) => {
        if (status.isInBlock) {
          console.log(`✅ Transaction included in block ${status.asInBlock.toString()}`);

          // Check for errors
          if (dispatchError) {
            let errorMessage = 'Transaction failed';

            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
            }

            console.error('❌ Transaction error:', errorMessage);
            resolve({
              success: false,
              error: errorMessage,
            });
          } else {
            // Success
            resolve({
              success: true,
              blockHash: status.asInBlock.toString(),
              transactionHash: tx.hash.toString(),
            });
          }
        } else if (status.isFinalized) {
          console.log(`✅ Transaction finalized in block ${status.asFinalized.toString()}`);
        }
      }).catch((error: any) => {
        console.error('❌ Transaction error:', error);
        resolve({
          success: false,
          error: error.message,
        });
      });
    });
  }

  /**
   * Estimate transaction fee
   */
  async estimateFee(
    tx: any,
    address: string,
    network?: NetworkType
  ): Promise<string> {
    try {
      const api = mainnetConnector.getApi(network);
      const info = await tx.paymentInfo(address);
      return info.partialFee.toString();
    } catch (error) {
      console.error('Error estimating fee:', error);
      return '0';
    }
  }
}

// Export singleton instance
export const palletInteraction = new PalletInteraction();
