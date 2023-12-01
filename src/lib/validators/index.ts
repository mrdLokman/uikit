import { VerifyEmailValidator } from "./verify-email-validator";
import { AccountCredentialsValidator } from './account-credencial-validator'
import { SignInCredentialsValidator } from './sign-in-credencial-validator'
import {z} from "zod";


export {
    VerifyEmailValidator,
    AccountCredentialsValidator,
    SignInCredentialsValidator
}

export type TAccountCredentialsValidator = z.infer<typeof AccountCredentialsValidator>;
export type TSignInCredentialsValidator = z.infer<typeof SignInCredentialsValidator>;
