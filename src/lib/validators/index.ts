import { VerifyEmailValidator } from "./verify-email-validator";
import { AccountCredentialsValidator } from './account-credencial-validator'
import { SignInCredentialsValidator } from './sign-in-credencial-validator'
import { ProductQueryValidator } from "./product-query-validator";
import { QueryValidator } from "./query-validator";
import { PaymentSessionValidator } from './payment-session-validator';
import {z} from "zod";


export {
    VerifyEmailValidator,
    AccountCredentialsValidator,
    SignInCredentialsValidator,
    ProductQueryValidator,
    QueryValidator,
    PaymentSessionValidator
}

export type TAccountCredentialsValidator = z.infer<typeof AccountCredentialsValidator>;
export type TSignInCredentialsValidator = z.infer<typeof SignInCredentialsValidator>;
export type TQueryValidator = z.infer<typeof QueryValidator>;
