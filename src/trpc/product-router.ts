import {publicProcedure, router} from "./trpc";
import {ProductQueryValidator} from "../lib/validators";
import {getPayloadClient} from "../get-payload";
import {TRPCError} from "@trpc/server";


export const productRouter = router({
    getInfiniteProducts: publicProcedure
        .input(ProductQueryValidator)
        .query(async ({input}) => {
            const {query, cursor} = input;
            const {limit, sort, ...queryOpts} = query;

            const page = cursor || 1;

            const parsedQuery: Record<string, {equal: string}> = {}

            Object.entries(queryOpts).forEach(([key, value])=>{
                parsedQuery[key] = {
                    equal: value
                }
            })

            
            const payload = await getPayloadClient();

            const {docs: items, hasNextPage, nextPage} = await payload.find({
                collection: 'products',
                where: {
                    approved_for_sale: {
                        equals: 'approved'
                    },
                    ...parsedQuery
                },
                sort,
                limit,
                depth: 1,
                page
            });

            return { items,  nextPage: hasNextPage? nextPage : null };
        }),

});