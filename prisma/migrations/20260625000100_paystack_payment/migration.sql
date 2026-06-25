-- Rename STRIPE to CARD in PaymentMethod enum
ALTER TYPE "PaymentMethod" RENAME VALUE 'STRIPE' TO 'CARD';

-- Replace stripeSessionId and mpesaCheckoutRequestId with paystackReference
ALTER TABLE "Order" RENAME COLUMN "stripeSessionId" TO "paystackReference";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "mpesaCheckoutRequestId";
