import axios from "axios";

const isSandbox = process.env.MPESA_ENV !== "production";
const baseUrl = isSandbox
  ? "https://sandbox.safaricom.co.ke"
  : "https://api.safaricom.co.ke";

function timestamp() {
  const now = new Date();
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("254")) return digits;
  return digits;
}

export async function getMpesaToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("M-Pesa credentials are not configured.");

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  return response.data.access_token as string;
}

export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  orderId: string;
}) {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!shortcode || !passkey || !callbackUrl) {
    throw new Error("M-Pesa STK settings are not configured.");
  }

  const token = await getMpesaToken();
  const time = timestamp();
  const password = Buffer.from(`${shortcode}${passkey}${time}`).toString("base64");

  const response = await axios.post(
    `${baseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: time,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(params.amount),
      PartyA: normalizePhone(params.phone),
      PartyB: shortcode,
      PhoneNumber: normalizePhone(params.phone),
      CallBackURL: callbackUrl,
      AccountReference: `Rodina-${params.orderId.slice(-8)}`,
      TransactionDesc: "Rodina Naturals order payment",
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
}
