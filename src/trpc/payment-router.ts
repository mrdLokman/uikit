import {privateProcedure, router} from "./trpc";
import {getPayloadClient} from "../get-payload";
import {PaymentSessionValidator} from "../lib/validators";
import {TRPCError} from "@trpc/server";
import {stripe} from "../lib/stripe";
import type Stripe from "stripe";


export const paymentRouter = router({
    createSession: privateProcedure
        .input(PaymentSessionValidator)
        .mutation(async ({ctx, input})=>{
            const {user} = ctx;
            let {productIds} = input;

            if(productIds.length === 0){
                throw new TRPCError({code: 'BAD_REQUEST'});
            }

            const payload = await getPayloadClient();

            const {docs: products} = await payload.find({
                collection: 'products',
                where: {
                    id: {
                        in: productIds,
                    }
                }
            });

            const filteredProducts = products
                .filter((p)=> Boolean(p.priceId));

            const order = await payload.create({
                collection: 'orders',
                data: {
                    _isPaid: false,
                    products: filteredProducts.map((p)=> p.id),
                    user: user.id,
                }
            })

            const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

            filteredProducts.forEach((product)=>{
                line_items.push({
                    price: product.priceId!,
                    quantity: 1,
                })
            })

            line_items.push({
                price: "price_1OKQmGBe0ZmaQzTTFI8wE68J",
                quantity: 1,
                adjustable_quantity: {
                    enabled: false,
                }
            })

            try {
                const stripeSession = await stripe.checkout.sessions.create({
                    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
                    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
                    payment_method_types: ["card"],
                    mode: "payment",
                    metadata: {
                        userId: user.id,
                        orderId: order.id,
                    },
                    line_items,
                });

                return {url: stripeSession.url};
            }
            catch (err){
                console.log(err);
                return {url: null};
            }

        }),
});