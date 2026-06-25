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
  amount: number; // in KES — converted to smallest unit (×100) internally
  reference: string;
  orderId: string;
  callbackUrl: string;
  channels?: string[];
  phone?: string; // required for mobile_money (M-Pesa) in Kenya
}): Promise<PaystackTransaction> {
  // Normalise Kenyan phone: 0712345678 → 254712345678
  const normalisePhone = (p: string) =>
    p.startsWith("0") ? `254${p.slice(1)}` : p.replace(/^\+/, "");

  return paystackFetch<PaystackTransaction>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100), // Paystack KES uses cents (×100)
      currency: "KES",
      reference: params.reference,
      callback_url: params.callbackUrl,
      channels: params.channels ?? ["card", "mobile_money"],
      ...(params.phone ? { mobile_number: normalisePhone(params.phone) } : {}),
      metadata: {
        orderId: params.orderId,
        ...(params.phone ? { phone: params.phone } : {}),
      },
    }),
  });
}

export async function verifyTransaction(reference: string): Promise<PaystackVerification> {
  return paystackFetch<PaystackVerification>(`/transaction/verify/${encodeURIComponent(reference)}`);
}
