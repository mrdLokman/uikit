import { z } from "zod";
import { QueryValidator } from "./query-validator";


export const ProductQueryValidator = z.object({
    limit: z.number().min(1).max(100),
    cursor: z.number().nullish(),
    query: QueryValidator,
});