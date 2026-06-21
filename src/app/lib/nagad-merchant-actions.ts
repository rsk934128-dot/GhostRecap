'use server';

/**
 * @fileOverview Nagad Merchant Pay Actions (M2M/C2B).
 * Handles QR scanning, USSD counter payments, and Gateway API simulations.
 */

import { generateNagadSignature } from '@/lib/security';
import { NagadMerchantPayPayload, NagadMerchantPayResponse } from '@/lib/types';

/**
 * Executes a merchant payment (C2B).
 * Simulates the "Tap and Hold" logic and validation of QR metadata.
 */
export async function executeNagadMerchantPay(input: NagadMerchantPayPayload): Promise<NagadMerchantPayResponse> {
  console.log(`--- NAGAD MERCHANT NODE: PROCESSING ${input.channel} PAYMENT ---`);
  
  // 1. Simulate QR/USSD Validation Handshake
  await new Promise(resolve => setTimeout(resolve, 2500));

  // 2. Validate Counter & Reference (Simulated Rules)
  if (input.channel === 'USSD' && !input.counterNumber) {
    return {
      success: false,
      message: 'Nagad Gateway: Counter Number is mandatory for USSD channel.',
      timestamp: new Date().toISOString()
    };
  }

  // 3. Generate Digital Signature for the Merchant Handshake
  const signature = generateNagadSignature({
    merchantAccount: input.merchantAccountNumber,
    amount: input.amount,
    reference: input.reference || 'N/A',
    channel: input.channel
  });

  // 4. Simulate Transaction Acceptance
  const isSuccess = Math.random() > 0.05;

  if (isSuccess) {
    return {
      success: true,
      transactionId: `NGD_C2B_${Math.random().toString(36).substring(7).toUpperCase()}`,
      message: `Merchant Payment of ৳ ${input.amount.toLocaleString()} successful via ${input.channel}.`,
      timestamp: new Date().toISOString(),
      metadata: {
        channel: input.channel,
        counter: input.counterNumber || '1',
        reference: input.reference || 'Nexus_Sale',
        signature
      }
    };
  } else {
    return {
      success: false,
      message: 'Nagad Gateway: Transaction declined by consumer node.',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Validates a Merchant QR payload before initiating payment.
 */
export async function validateMerchantQR(qrData: string): Promise<{ isValid: boolean; merchantName: string }> {
  // Simulate decoding of Nagad QR Payload
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    isValid: true,
    merchantName: "Nexus Global Store (Node 400)"
  };
}
