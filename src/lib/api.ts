import axios from "@/lib/axios.config";

// client: api.ts
export async function createTicketFromItem(
  item: { type: string; isChargeable?: boolean; details?: string },
  ctx: {
    propertyId: number;
    bookingId?: number | null;
    roomId?: number | null;
    guestId?: number | null;
  }
) {
  const idempotencyKey = crypto.randomUUID();
  // Save the idempotency key in meta for later reference
  const res = await axios.post(
    "/chatbot/reply",
    {
      type: item.type,
      isPaid: !!item.isChargeable,
      details: item.details,
      idempotencyKey,
      context: { ...ctx, channel: "CHATBOT" },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey, // optional header; also saved in meta
      },
    }
  );
  if (res.status < 200 || res.status >= 300)
    throw new Error(`Ticket create failed: ${res.status}`);
  return res.data; // {ticketId, status, dueAt, existed?}
}
