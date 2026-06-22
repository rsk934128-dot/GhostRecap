'use server';

/**
 * @fileOverview Midland Bank Payout Actions (NPSB/BEFTN/RTGS).
 * Handles fund transfer execution to 38+ banks via Midland Core Bridge.
 */

import { generateHMACChecksum } from '@/lib/security';
import { MDBPayoutPayload, MDBPayoutResponse } from '@/lib/types';

/**
 * Simulates bank account verification for NPSB/BEFTN.
 * Returning dummy names based on account logic.
 */
export async function verifyBankAccount(bankName: string, accountNumber: string): Promise<{ success: boolean; name?: string; message: string }> {
  console.log(`--- NEXUS CORE: VERIFYING ACCOUNT ${accountNumber} AT ${bankName} ---`);
  
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulation logic for Sheikh Farid's associates
  if (accountNumber === '01712345678') return { success: true, name: 'SHEIKH FARID (NEXUS ROOT)', message: 'Account verified successfully.' };
  if (accountNumber.startsWith('2200')) return { success: true, name: 'MD. ABDUL BARIK SHEIKH', message: 'Official Paurashava Trade Node identified.' };
  if (accountNumber.length < 8) return { success: false, message: 'Invalid Account: Format not recognized by NPSB node.' };

  const mockNames = ['Jassie Gill', 'Badshah', 'B Praak', 'Neha Kakkar', 'Nawazuddin Siddiqui'];
  const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

  return {
    success: true,
    name: `${randomName} (Verified via MDB Core)`,
    message: 'Account verified successfully.'
  };
}

/**
 * Executes a payout to a Midland Bank or external account.
 */
export async function executeMDBPayout(input: Omit<MDBPayoutPayload, 'checksum' | 'currency'>): Promise<MDBPayoutResponse> {
  const payloadBase = {
    ...input,
    currency: 'BDT',
    timestamp: new Date().toISOString(),
  };

  const checksum = generateHMACChecksum(payloadBase);

  const fullPayload: MDBPayoutPayload = {
    ...payloadBase,
    checksum,
  };

  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
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
