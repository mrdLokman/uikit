import {z} from "zod";

export const OrderStatusValidator = z.object({
    orderId: z.string(),
});

