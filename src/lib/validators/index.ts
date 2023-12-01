import { VerifyEmailValidator } from "./verify-email-validator";
import { AccountCredentialsValidator } from './account-credencial-validator'
import {z} from "zod";


export {
    VerifyEmailValidator,
    AccountCredentialsValidator
}

export type TAccountCredentialsValidator = z.infer<typeof AccountCredentialsValidator>;
