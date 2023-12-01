import {z} from "zod";

export const VerifyEmailValidator = z.object({
    token: z.string()
});