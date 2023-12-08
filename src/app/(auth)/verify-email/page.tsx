import Image from "next/image";
import { VerifyEmail } from "@/components/verify-email";

type PageProps = {
    searchParams: {
        [key: string]: string | string[] | undefined,
    }
}

const Page = ({ searchParams }: PageProps)=>{
    const token = searchParams.token;
    const toEmail = searchParams.to;

    return (
        <div className="container relative flex flex-col justify-center items-center pt-20 lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                {
                    token && typeof token === "string" ? (
                        <div className="grid gap-6">
                            <VerifyEmail token={token}/>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col justify-center items-center space-y-1">
                            <div className="relative mb-4 h-60 w-60 text-muted-foreground">
                                <Image
                                    src="/hippo-email-sent.png"
                                    alt="hippo email sent image"
                                    fill
                                />
                            </div>

                            <h3 className="font-semibold text-2xl">Check your email</h3>

                            {
                                toEmail? (
                                    <p className="text-muted-foreground text-center">
                                        we&apos;ve sent a verification email to <span className="font-semibold">{toEmail}</span>.
                                    </p>
                                ):(
                                    <p className="text-muted-foreground text-center">
                                        we&apos;ve sent a verification email to tour email.
                                    </p>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
}


export default Page;