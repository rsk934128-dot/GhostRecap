'use server';

/**
 * @fileOverview Midland Bank Payout Actions (NPSB/BEFTN).
 * Handles fund transfer execution and transaction verification.
 */

import { generateHMACChecksum } from '@/lib/security';
import { MDBPayoutPayload, MDBPayoutResponse } from '@/lib/types';

/**
 * Executes a payout to a Midland Bank or external account.
 * This function handles payload construction and checksum validation.
 */
export async function executeMDBPayout(input: Omit<MDBPayoutPayload, 'checksum' | 'currency'>): Promise<MDBPayoutResponse> {
  // 1. Construct the payload base
  const payloadBase = {
    ...input,
    currency: 'BDT',
    timestamp: new Date().toISOString(),
  };

  // 2. Generate Checksum for HMAC_V4 SHA256 Validation
  const checksum = generateHMACChecksum(payloadBase);

  // 3. Complete the Payout Payload
  const fullPayload: MDBPayoutPayload = {
    ...payloadBase,
    checksum,
  };

  console.log('--- NEXUS CORE: DISPATCHING PAYOUT ---');
  console.log('Payload:', fullPayload);

  // 4. Simulate API Handshake with Midland Core Banking System (CBS)
  try {
    // Artificial latency for bank switch response
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulation of success (95% success rate for sandbox testing)
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `MDB_NPSB_${Math.random().toString(36).substring(7).toUpperCase()}`,
        message: 'Fund transfer request accepted by MDB Core Gateway.',
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error('MDB Gateway Connection Timeout (Error 504)');
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'MDB Core Bridge reset during transmission.',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Verifies the status of a pending transaction from the MDB Webhook.
 */
export async function verifyTransactionStatus(transactionId: string): Promise<{ status: string; code: string }> {
  // In a real scenario, this would query the Midland Transaction Inquiry API.
  return {
    status: 'SETTLED',
    code: '00',
  };
}
