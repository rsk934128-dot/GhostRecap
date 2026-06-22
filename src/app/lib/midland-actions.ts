'use server';

/**
 * @fileOverview Midland Bank Payout Actions (NPSB/BEFTN/RTGS).
 * Handles fund transfer execution to 38+ banks via Midland Core Bridge.
 */

import { generateHMACChecksum } from '@/lib/security';
import { MDBPayoutPayload, MDBPayoutResponse } from '@/lib/types';

/**
 * Executes a payout to a Midland Bank or external account.
 * This function handles payload construction and checksum validation for inter-bank routing.
 */
export async function executeMDBPayout(input: Omit<MDBPayoutPayload, 'checksum' | 'currency'>): Promise<MDBPayoutResponse> {
  // 1. Construct the payload base with destination metadata
  const payloadBase = {
    ...input,
    currency: 'BDT',
    timestamp: new Date().toISOString(),
  };

  // 2. Generate Checksum for HMAC_V4 SHA256 Validation
  // This is required for secure handshakes with the Midland Core Banking System
  const checksum = generateHMACChecksum(payloadBase);

  // 3. Complete the Payout Payload
  const fullPayload: MDBPayoutPayload = {
    ...payloadBase,
    checksum,
  };

  console.log('--- NEXUS CORE: DISPATCHING INTER-BANK SETTLEMENT ---');
  console.log('Target Node:', input.destinationAccountNumber);
  console.log('Routing Meta:', input.narration);

  // 4. Simulate API Handshake with Midland Core Banking System (CBS)
  // This routes the fund through NPSB (National Payment Switch) to any of the 38 banks.
  try {
    // Artificial latency for bank switch response (NPSB Handshake)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulation of success (95% success rate for sandbox testing)
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `MDB_NPSB_${Math.random().toString(36).substring(7).toUpperCase()}`,
        message: `Settlement request accepted by MDB Core Gateway. Funds dispatched to ${input.destinationAccountNumber} via NPSB rail.`,
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error('MDB Gateway Connection Timeout (Error 504) - Inter-bank switch busy.');
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'MDB Core Bridge reset during transmission.',
      timestamp: new Date().toISOString(),
    };
  }
}
