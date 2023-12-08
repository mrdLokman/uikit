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
import {SignInCredentialsValidator, TSignInCredentialsValidator} from "@/lib/validators";
import {trpc} from "@/trpc/client";
import {toast} from "sonner";
import {ZodError} from "zod";
import {useRouter, useSearchParams} from "next/navigation"

const Page = ()=>{
    const searchParams = useSearchParams();
    const router = useRouter();

    const isSeller = searchParams.get('as') === 'seller';
    const nextUrl = searchParams.get('next');

    const continueAsSeller = ()=>{
        router.push("?as=seller");
    };
    const continueAsCustomer= ()=>{
        router.replace("/sign-in", undefined);
    };

    const { register, handleSubmit, formState: {errors}} = useForm<TSignInCredentialsValidator>({
        resolver: zodResolver(SignInCredentialsValidator)
    });

    const { mutate: signIn, isLoading } = trpc.auth.signInUser.useMutation({
        onError: (err)=>{
            if(err.data?.code==="UNAUTHORIZED"){
                toast.error('Invalid credentials')
                return
            }

            if(err instanceof ZodError){
                toast.error(err.issues[0].message)
                return
            }

            toast.error('Unexpected error occurred!')
        },
        onSuccess: ()=>{
            toast.success(`Signed successfully`)
            router.refresh();
            if(nextUrl){
                router.push(`/${nextUrl}`);
                router.refresh();
                return
            }
            if(isSeller){
                router.push("/admin");
                return
            }
            router.push("/");
            router.refresh();
        }
    });

    const onSubmit = ({email, password}: TSignInCredentialsValidator)=>{
        signIn({email, password})
    };

    return (<>
        <div className="container relative flex justify-center items-center pt-20 lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 items-center text-center">
                    <Icons.logo className="h-20 w-20" />
                    <h1 className="text-2xl font-bold">
                        Sign in to your {isSeller? "seller": ""}{" "} account
                    </h1>

                    <Link
                        className={buttonVariants({
                            variant: 'link',
                            className: "gap-1.5"
                        })}
                        href="/sign-up"
                    >
                        Don&apos;t have an account? sign-up
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

                            <Button disabled={isLoading}>Sign in</Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div aria-hidden="true" className="absolute flex items-center inset-0">
                            <span className="w-full border-t"/>
                        </div>

                        <div className="relative flex justify-center text-sm uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                or
                            </span>
                        </div>
                    </div>

                    {isSeller ? (
                        <Button
                            onClick={continueAsCustomer}
                            variant="secondary"
                            disabled={isLoading}
                        >
                            Continue as customer
                        </Button>
                    ):(
                        <Button
                            onClick={continueAsSeller}
                            variant="secondary"
                            disabled={isLoading}
                        >
                            Continue as seller
                        </Button>
                    )}
                </div>
            </div>
        </div>
    </>)
}

export default Page;