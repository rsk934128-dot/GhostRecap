'use server';

/**
 * @fileOverview Nagad Bill Pay Actions.
 * Handles Utility, Education, and Internet bill payments.
 * Includes slab-based charge calculation and service routing.
 */

import { generateNagadSignature } from '@/lib/security';
import { NagadBillPayPayload, NagadBillPayResponse, NagadBiller } from '@/lib/types';
import { MOCK_NAGAD_BILLERS } from '@/lib/mock-data';

/**
 * Calculates the service charge based on biller configuration and amount.
 */
function calculateServiceCharge(biller: NagadBiller, amount: number): number {
  if (biller.chargeType === 'Fixed') {
    return biller.chargeValue;
  }
  
  // Simulated Slab-based logic
  if (amount <= 500) return biller.chargeValue;
  if (amount <= 1500) return biller.chargeValue + 5;
  if (amount <= 5000) return biller.chargeValue + 15;
  return biller.chargeValue + 25;
}

/**
 * Executes a Bill Payment via Nagad Gateway.
 * Simulates authentication, charge calculation, and RSA signing.
 */
export async function executeNagadBillPay(input: NagadBillPayPayload): Promise<NagadBillPayResponse> {
  console.log(`--- NAGAD BILLPAY NODE: PROCESSING ${input.billerCode} ---`);
  
  const biller = MOCK_NAGAD_BILLERS.find(b => b.code === input.billerCode);
  if (!biller) {
    throw new Error('Biller Node not found in directory.');
  }

  const charge = calculateServiceCharge(biller, input.amount);
  const totalAmount = input.amount + charge;

  // 1. Simulate Gateway Handshake
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 2. Generate RSA Signature for the Bill Fragment
  const signature = generateNagadSignature({
    billerCode: input.billerCode,
    accountNo: input.accountNo,
    amount: input.amount,
    charge,
    timestamp: new Date().toISOString()
  });

  // 3. Simulate Gateway Response
  const isSuccess = Math.random() > 0.05;

  if (isSuccess) {
    return {
      success: true,
      transactionId: `NGD_BILL_${Math.random().toString(36).substring(7).toUpperCase()}`,
      message: `Bill Payment of ৳ ${input.amount.toLocaleString()} to ${biller.name} successful.`,
      charge,
      totalAmount,
      timestamp: new Date().toISOString()
    };
  } else {
    return {
      success: false,
      message: 'Nagad Gateway: Biller system is currently unresponsive.',
      charge: 0,
      totalAmount: 0,
      timestamp: new Date().toISOString()
    };
  }
}