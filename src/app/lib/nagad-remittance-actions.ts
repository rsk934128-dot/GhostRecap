'use server';

/**
 * @fileOverview Nagad Global Remittance Actions.
 * Handles inbound transfers from international MTOs (Western Union, RIA, etc.).
 * Implements the 2.5% Government Incentive logic.
 */

import { InboundRemittancePayload, RemittanceDisbursementResult } from '@/lib/types';
import { generateNagadSignature } from '@/lib/security';

/**
 * Executes a global remittance disbursement.
 * Calculates principal + 2.5% incentive and generates a single notification.
 */
export async function executeGlobalRemittance(payload: InboundRemittancePayload): Promise<RemittanceDisbursementResult> {
  console.log(`--- GLOBAL BRIDGE: PROCESSING REMITTANCE FROM ${payload.sourceCountry} ---`);
  
  // 1. Calculate Incentive
  const principal = payload.principalAmountBDT;
  const incentive = principal * 0.025; // 2.5% Government Incentive
  const total = principal + incentive;
  
  // 2. Simulate Gateway Handshake with Global MTO Node
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const isSuccess = Math.random() > 0.05;
  
  if (isSuccess) {
    const txId = "TXN_REMIT_" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Official compliance: Generate a single SMS payload
    const smsText = `Remittance Received via ${payload.mtoProvider}. Principal: BDT ${principal.toFixed(2)}, Gov Incentive (2.5%): BDT ${incentive.toFixed(2)}. Total Credited: BDT ${total.toFixed(2)}. Txn ID: ${txId}.`;
    
    return {
      txId,
      principalAmount: principal,
      governmentIncentive: incentive,
      totalCreditedAmount: total,
      notificationPayload: smsText,
      status: 'Settled',
      message: `Global Remittance of ৳ ${principal.toLocaleString()} (plus ৳ ${incentive.toLocaleString()} incentive) successfully disbursed.`
    };
  } else {
    return {
      txId: '',
      principalAmount: 0,
      governmentIncentive: 0,
      totalCreditedAmount: 0,
      notificationPayload: '',
      status: 'Failed',
      message: 'Global MTO Bridge: Handshake timed out or invalid reference number.'
    };
  }
}
