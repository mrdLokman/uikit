import {z} from "zod";

export const PaymentSessionValidator = z.object({
    productIds: z.array(z.string()),
});

