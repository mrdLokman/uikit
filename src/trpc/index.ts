import {publicProcedure, router} from "./trpc";
import {authRouter} from "./auth-router";
import {productRouter} from "./product-router";
import {paymentRouter} from "./payment-router";

export const appRouter = router({
    auth: authRouter,
    products: productRouter,
    payment: paymentRouter,
});

export type AppRouter = typeof appRouter;