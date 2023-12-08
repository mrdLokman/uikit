"use client"

import {Icons} from '@/components/icons'
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AccountCredentialsValidator, TAccountCredentialsValidator} from "@/lib/validators";
import {trpc} from "@/trpc/client";
import {toast} from "sonner";
import {ZodError} from "zod";
import {useRouter} from "next/navigation"

const Page = ()=>{
    const router = useRouter();

    const { register, handleSubmit, formState: {errors}} = useForm<TAccountCredentialsValidator>({
        resolver: zodResolver(AccountCredentialsValidator)
    });

    const { mutate } = trpc.auth.createPayloadUser.useMutation({
        onError: (err)=>{
            if(err.data?.code==="CONFLICT"){
                toast.error('This email already exist. Sign in instead?')
                return
            }

            if(err instanceof ZodError){
                toast.error(err.issues[0].message)
                return
            }

            toast.error('Unexpected error occurred!')
        },
        onSuccess: ({sentToEmail})=>{
            toast.success(`A verification email was sent to ${sentToEmail}`)
            router.push(`/verify-email?to=${sentToEmail}`);
        }
    });

    const onSubmit = ({email, password}: TAccountCredentialsValidator)=>{
        mutate({email, password})
    };

    return (<>
        <div className="container relative flex justify-center items-center pt-20 lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 items-center text-center">
                    <Icons.logo className="h-20 w-20" />
                    <h1 className="text-2xl font-bold">
                       Create an account
                    </h1>

                    <Link
                        className={buttonVariants({
                            variant: 'link',
                            className: "gap-1.5"
                        })}
                        href="/sign-in"
                    >
                        Already have an account? sign-in
                        <ArrowRight className="h-4 w-4"/>
                    </Link>
                </div>

                <div className="grid gap-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <div className="grid gap-1 py-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    {...register("email")}
                                    className={cn({
                                        "focus-visible:ring-red-500": errors.email
                                    })}
                                    placeholder="you@example.com"
                                />
                                { errors?.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="grid gap-1 py-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    {...register("password")}
                                    className={cn({
                                        "focus-visible:ring-red-500": errors.password
                                    })}
                                    type="password"
                                    placeholder="password"
                                />
                                { errors?.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <Button>Sign up</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>)
}

export default Page;