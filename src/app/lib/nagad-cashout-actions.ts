'use server';

/**
 * @fileOverview Nagad Cash Out Actions.
 * Handles outbound fund withdrawals via Uddokta (Agent) nodes.
 * Implements official charge slabs: 12.99 (Regular App), 15.00 (Islamic/USSD).
 */

import { generateNagadSignature } from '@/lib/security';
import { NagadCashOutPayload, CashOutFeeResult } from '@/lib/types';

/**
 * Calculates the Cash Out fee based on Nagad official slabs.
 * Uses the 'Equal Ratio' calculation policy.
 */
export async function calculateCashOutFee(amount: number, appType: NagadCashOutPayload['appType']): Promise<CashOutFeeResult> {
  let ratePerThousand = 15.00; // Default USSD or Islamic rate
  
  if (appType === 'REGULAR_APP') {
    ratePerThousand = 12.99;
  }

  // Equal Ratio calculation logic
  const calculatedFee = (amount / 1000) * ratePerThousand;
  const totalDeductedAmount = amount + calculatedFee;

  return {
    txId: '',
    principalAmount: amount,
    calculatedFee,
    totalDeductedAmount,
    status: 'Success',
    message: 'Fee calculated based on official Nagad slabs.',
    timestamp: new Date().toISOString()
  };
}

/**
 * Executes a Cash Out simulation via Nagad Gateway.
 * Simulates Uddokta QR handshake and wallet mutation.
 */
export async function executeNagadCashOut(input: NagadCashOutPayload): Promise<CashOutFeeResult> {
  console.log(`--- NAGAD CASHOUT NODE: PROCESSING withdrawal via ${input.appType} ---`);
  
  // 1. Calculate Fee
  const feeInfo = await calculateCashOutFee(input.amount, input.appType);
  
  // 2. Simulate Gateway/Uddokta Handshake
  await new Promise(resolve => setTimeout(resolve, 3500));

  const isSuccess = Math.random() > 0.05;

  if (isSuccess) {
    const txId = "NGD_CASH_" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    return {
      ...feeInfo,
      txId,
      status: 'Success',
      message: `Cash Out of ৳ ${input.amount.toLocaleString()} successful via Uddokta ${input.uddoktaNumber}.`
    };
  } else {
    return {
      ...feeInfo,
      txId: '',
      status: 'Failed',
      message: 'Nagad Gateway: Uddokta node connection failed or PIN invalid.'
    };
  }
}
