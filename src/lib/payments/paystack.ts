const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const BASE_URL = "https://api.paystack.co";

async function paystackFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const data = await response.json();
  if (!data.status) throw new Error(data.message || "Paystack request failed");
  return data.data as T;
}

export type PaystackTransaction = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type PaystackVerification = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata: { orderId?: string };
};

export async function initializeTransaction(params: {
  email: string;
  amount: number; // in KES (will be converted to cents)
  reference: string;
  orderId: string;
  callbackUrl: string;
  channels?: string[];
}): Promise<PaystackTransaction> {
  return paystackFetch<PaystackTransaction>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100), // kobo/cents
      currency: "KES",
      reference: params.reference,
      callback_url: params.callbackUrl,
      channels: params.channels ?? ["card", "mobile_money"],
      metadata: { orderId: params.orderId },
    }),
  });
}

export async function verifyTransaction(reference: string): Promise<PaystackVerification> {
  return paystackFetch<PaystackVerification>(`/transaction/verify/${encodeURIComponent(reference)}`);
}
