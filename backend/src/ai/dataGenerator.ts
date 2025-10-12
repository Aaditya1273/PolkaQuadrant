import { ContributionData } from '../types/ai';

/**
 * Synthetic Data Generator for Quadratic Funding Fraud Detection
 * Generates realistic contribution patterns including normal and fraudulent behaviors
 */
export class DataGenerator {
  /**
   * Generate a dataset of contributions
   * @param count Total number of contributions to generate
   * @param fraudPercentage Percentage of fraudulent contributions (0-1)
   */
  generateDataset(
    count: number,
    fraudPercentage: number = 0.2
  ): ContributionData[] {
    const dataset: ContributionData[] = [];
    const fraudCount = Math.floor(count * fraudPercentage);
    const normalCount = count - fraudCount;

    // Generate normal contributions
    for (let i = 0; i < normalCount; i++) {
      dataset.push(this.generateNormalContribution());
    }

    // Generate fraudulent contributions
    for (let i = 0; i < fraudCount; i++) {
      const fraudType = Math.random();
      if (fraudType < 0.4) {
        dataset.push(this.generateSybilAttack());
      } else if (fraudType < 0.7) {
        dataset.push(this.generateWashTrading());
      } else {
        dataset.push(this.generateBotBehavior());
      }
    }

    // Shuffle the dataset
    return this.shuffleArray(dataset);
  }

  /**
   * Generate a normal, legitimate contribution
   */
  private generateNormalContribution(): ContributionData {
    const walletAge = this.randomInt(30, 365); // 1 month to 1 year
    const frequency = this.randomInt(1, 10); // 1-10 contributions
    const amount = this.randomNormal(5000, 2000); // Normal distribution around 5000
    const uniqueProjects = this.randomInt(3, 20); // Diverse portfolio
    const transactionCount = this.randomInt(50, 500);
    const averageAmount = amount * this.randomFloat(0.8, 1.2);
    const timeVariance = this.randomFloat(0.3, 0.9); // Natural variation
    const roundParticipation = this.randomInt(1, 5);

    return {
      amount: Math.max(100, amount),
      frequency,
      walletAge,
      transactionCount,
      averageAmount: Math.max(100, averageAmount),
      timeVariance,
      uniqueProjects,
      roundParticipation,
      label: 0, // Normal
    };
  }

  /**
   * Generate a Sybil attack pattern
   * Characteristics: New wallet, high frequency, small amounts, low diversity
   */
  private generateSybilAttack(): ContributionData {
    const walletAge = this.randomInt(1, 30); // Very new wallet
    const frequency = this.randomInt(15, 50); // High frequency
    const amount = this.randomInt(10, 200); // Small amounts
    const uniqueProjects = this.randomInt(1, 3); // Low diversity
    const transactionCount = this.randomInt(10, 100);
    const averageAmount = amount * this.randomFloat(0.9, 1.1);
    const timeVariance = this.randomFloat(0.05, 0.3); // Low variance (bot-like)
    const roundParticipation = this.randomInt(1, 3);

    return {
      amount,
      frequency,
      walletAge,
      transactionCount,
      averageAmount,
      timeVariance,
      uniqueProjects,
      roundParticipation,
      label: 1, // Fraudulent
    };
  }

  /**
   * Generate a wash trading pattern
   * Characteristics: Repetitive amounts, same projects, high frequency
   */
  private generateWashTrading(): ContributionData {
    const baseAmount = this.randomInt(1000, 5000);
    const walletAge = this.randomInt(10, 90);
    const frequency = this.randomInt(20, 60); // Very high frequency
    const amount = baseAmount + this.randomInt(-50, 50); // Very similar amounts
    const uniqueProjects = this.randomInt(1, 2); // Same project(s)
    const transactionCount = this.randomInt(100, 300);
    const averageAmount = baseAmount; // Almost identical
    const timeVariance = this.randomFloat(0.02, 0.15); // Very low variance
    const roundParticipation = this.randomInt(2, 5);

    return {
      amount,
      frequency,
      walletAge,
      transactionCount,
      averageAmount,
      timeVariance,
      uniqueProjects,
      roundParticipation,
      label: 1, // Fraudulent
    };
  }

  /**
   * Generate bot-like behavior
   * Characteristics: Perfect timing, consistent amounts, mechanical patterns
   */
  private generateBotBehavior(): ContributionData {
    const amount = this.randomInt(500, 3000);
    const walletAge = this.randomInt(5, 60);
    const frequency = this.randomInt(25, 80); // Very high frequency
    const uniqueProjects = this.randomInt(2, 5);
    const transactionCount = this.randomInt(150, 400);
    const averageAmount = amount; // Exactly the same
    const timeVariance = this.randomFloat(0.01, 0.08); // Almost no variance
    const roundParticipation = this.randomInt(1, 4);

    return {
      amount,
      frequency,
      walletAge,
      transactionCount,
      averageAmount,
      timeVariance,
      uniqueProjects,
      roundParticipation,
      label: 1, // Fraudulent
    };
  }

  /**
   * Generate LATAM-specific realistic dataset
   * Based on Buenos Aires, Mexico City, and São Paulo patterns
   */
  generateLATAMDataset(count: number = 1000): ContributionData[] {
    const dataset: ContributionData[] = [];

    // 70% normal community contributions
    const normalCount = Math.floor(count * 0.7);
    for (let i = 0; i < normalCount; i++) {
      dataset.push(this.generateLATAMNormalContribution());
    }

    // 15% Sybil attacks
    const sybilCount = Math.floor(count * 0.15);
    for (let i = 0; i < sybilCount; i++) {
      dataset.push(this.generateSybilAttack());
    }

    // 10% wash trading
    const washCount = Math.floor(count * 0.1);
    for (let i = 0; i < washCount; i++) {
      dataset.push(this.generateWashTrading());
    }

    // 5% bot behavior
    const botCount = count - normalCount - sybilCount - washCount;
    for (let i = 0; i < botCount; i++) {
      dataset.push(this.generateBotBehavior());
    }

    return this.shuffleArray(dataset);
  }

  /**
   * Generate LATAM-specific normal contribution
   * Smaller amounts, community-focused
   */
  private generateLATAMNormalContribution(): ContributionData {
    const walletAge = this.randomInt(60, 400); // Established wallets
    const frequency = this.randomInt(2, 8); // Moderate frequency
    const amount = this.randomNormal(2000, 1000); // Lower amounts (LATAM context)
    const uniqueProjects = this.randomInt(4, 15); // Community diverse
    const transactionCount = this.randomInt(30, 200);
    const averageAmount = amount * this.randomFloat(0.7, 1.3);
    const timeVariance = this.randomFloat(0.4, 0.95); // Natural human behavior
    const roundParticipation = this.randomInt(1, 4);

    return {
      amount: Math.max(50, amount),
      frequency,
      walletAge,
      transactionCount,
      averageAmount: Math.max(50, averageAmount),
      timeVariance,
      uniqueProjects,
      roundParticipation,
      label: 0,
    };
  }

  /**
   * Generate Buenos Aires Art Grant specific dataset
   */
  generateBuenosAiresArtGrant(contributionCount: number = 100): {
    contributions: ContributionData[];
    metadata: {
      totalAmount: number;
      uniqueWallets: number;
      flaggedCount: number;
      averageContribution: number;
    };
  } {
    const contributions = this.generateLATAMDataset(contributionCount);
    
    const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
    const flaggedCount = contributions.filter(c => c.label === 1).length;
    const averageContribution = totalAmount / contributionCount;

    return {
      contributions,
      metadata: {
        totalAmount,
        uniqueWallets: contributionCount,
        flaggedCount,
        averageContribution,
      },
    };
  }

  /**
   * Utility: Random integer between min and max (inclusive)
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Utility: Random float between min and max
   */
  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Utility: Normal distribution (Box-Muller transform)
   */
  private randomNormal(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  /**
   * Utility: Shuffle array (Fisher-Yates)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Export dataset to JSON
   */
  exportToJSON(dataset: ContributionData[], filename: string = 'training_data.json'): string {
    return JSON.stringify({
      metadata: {
        totalSamples: dataset.length,
        normalSamples: dataset.filter(d => d.label === 0).length,
        fraudulentSamples: dataset.filter(d => d.label === 1).length,
        generatedAt: new Date().toISOString(),
      },
      data: dataset,
    }, null, 2);
  }

  /**
   * Generate statistics about the dataset
   */
  getDatasetStatistics(dataset: ContributionData[]): {
    total: number;
    normal: number;
    fraudulent: number;
    fraudPercentage: number;
    averageAmount: number;
    averageWalletAge: number;
    averageFrequency: number;
  } {
    const normal = dataset.filter(d => d.label === 0).length;
    const fraudulent = dataset.filter(d => d.label === 1).length;
    const avgAmount = dataset.reduce((sum, d) => sum + d.amount, 0) / dataset.length;
    const avgWalletAge = dataset.reduce((sum, d) => sum + d.walletAge, 0) / dataset.length;
    const avgFrequency = dataset.reduce((sum, d) => sum + d.frequency, 0) / dataset.length;

    return {
      total: dataset.length,
      normal,
      fraudulent,
      fraudPercentage: (fraudulent / dataset.length) * 100,
      averageAmount: avgAmount,
      averageWalletAge: avgWalletAge,
      averageFrequency: avgFrequency,
    };
  }
}

// Export singleton instance
export const dataGenerator = new DataGenerator();
