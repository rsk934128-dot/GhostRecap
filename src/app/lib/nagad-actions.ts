'use server';

/**
 * @fileOverview Nagad B2B Payout Actions.
 * Handles Merchant-to-Personal (M2P) fund transfers and RSA signing.
 * Includes support for EMI, Microfinance, and Philanthropy settlements.
 */

import { generateNagadSignature } from '@/lib/security';
import { NagadPayoutPayload, NagadPayoutResponse } from '@/lib/types';

/**
 * Executes a payout to a Nagad account.
 * Handles RSA signature generation and simulated API handshake.
 */
export async function executeNagadPayout(input: Omit<NagadPayoutPayload, 'signature' | 'challenge' | 'currency' | 'merchantId'>): Promise<NagadPayoutResponse> {
  // 1. Construct the payload base
  const payloadBase = {
    ...input,
    merchantId: 'NEXUS_MERCHANT_400',
    currency: 'BDT' as const,
    challenge: Math.random().toString(36).substring(7).toUpperCase(),
    timestamp: new Date().toISOString(),
  };

  // 2. Generate RSA-2048 Digital Signature
  const signature = generateNagadSignature(payloadBase);

  // 3. Complete the Payout Payload
  const fullPayload: NagadPayoutPayload = {
    ...payloadBase,
    signature,
  };

  console.log('--- NAGAD BRIDGE: DISPATCHING PAYOUT ---');
  console.log('Payload:', fullPayload);
  
  if (input.metadata?.mfiOrg) {
    console.log(`Processing MFI Settlement for: ${input.metadata.mfiOrg} (${input.metadata.mfiBranch})`);
  }

  if (input.metadata?.philanthropyOrg) {
    console.log(`Processing Philanthropy Donation to: ${input.metadata.philanthropyOrg} (${input.metadata.donationCategory})`);
  }

  // 4. Simulate API Handshake with Nagad Gateway
  try {
    // Artificial latency for RSA processing and gateway response
    await new Promise(resolve => setTimeout(resolve, 3500));

    // Simulation of success (92% success rate for sandbox testing)
    const random = Math.random();
    const isSuccess = random > 0.08;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `NGD_M2P_${Math.random().toString(36).substring(7).toUpperCase()}`,
        message: 'Fund transfer accepted by Nagad B2B Gateway.',
        timestamp: new Date().toISOString(),
      };
    } else {
      // Specific RSA/Cryptographic simulation errors
      if (random < 0.04) {
        throw new Error('Nagad Gateway: RSA Decryption Error (Invalid Padding)');
      } else {
        throw new Error('Nagad Gateway: Challenge Expired or Signature Mismatch');
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Nagad Bridge reset during transmission.',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Simulates the "Bank to Nagad" liquidity synchronization.
 */
export async function executeBankToNagadSync(input: { bankName: string; amount: number }): Promise<{ success: boolean; message: string; transactionId?: string }> {
  console.log(`--- NAGAD LIQUIDITY OCEAN: SYNCING FROM ${input.bankName.toUpperCase()} ---`);
  
  try {
    // Simulate inter-node RSA handshake and settlement
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    return {
      success: true,
      message: `Successfully synchronized ৳ ${input.amount.toLocaleString()} from ${input.bankName} node.`,
      transactionId: `NGD_SYNC_${Math.random().toString(36).substring(7).toUpperCase()}`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Liquidity fragment rejected by Nagad Gateway Node.',
    };
  }
}
