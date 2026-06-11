import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-cream px-4 py-32">
      <div className="mx-auto max-w-2xl bg-white p-10 text-center shadow-[0_18px_60px_rgba(77,12,18,0.08)]">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Order received</p>
        <h1 className="mt-4 text-5xl">Thank You</h1>
        <p className="mt-5 leading-8 text-ink/70">
          Your order has been created. If you selected M-Pesa, confirm the STK push on your phone.
        </p>
        <Link href="/shop" className="btn-primary mt-8">Continue Shopping</Link>
      </div>
    </div>
  );
}
