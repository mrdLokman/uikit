import {publicProcedure, router} from "./trpc";
import {AccountCredentialsValidator, VerifyEmailValidator} from "../lib/validators";
import {getPayloadClient} from "../get-payload";
import {TRPCError} from "@trpc/server";


export const authRouter = router({
    createPayloadUser: publicProcedure
        .input(AccountCredentialsValidator)
        .mutation(async ({input}) => {
            const {email, password} = input;
            const payload = await getPayloadClient();

            console.log(`Registrin EMAIL:${email}, PWD: ${password}`)
            payload.logger.info(`Registrin EMAIL:${email}, PWD: ${password}`)

            const { docs: users } = await payload.find({
                collection: "users",
                where: {
                    email: {
                        equals: email
                    }
                }
            })

            if(users.length !== 0)
                throw new TRPCError({code: "CONFLICT"})

            await payload.create({
                collection: "users",
                data: {
                    email,
                    password,
                    role: 'user',
                }
            })

            return { success: true, sentToEmail: email }
        }),

    verifyEmail: publicProcedure
        .input(VerifyEmailValidator)
        .query(async ({input})=>{
            const { token } = input;

            const payload = await getPayloadClient();
            const isVerified = await payload.verifyEmail({
                collection: "users",
                token
            })

            if(!isVerified){
                throw new TRPCError({code: "UNAUTHORIZED"})
            }

            return { success: true }
        }),
});