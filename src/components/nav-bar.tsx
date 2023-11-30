import {MaxWidthWrapper} from "@/components/max-width-wrapper";
import {Icons} from "@/components/icons";
import {NavItems} from "@/components/nav-items";
import {Cart} from "@/components/cart";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

const NavBar = ()=>{
    const user = null;
    return (
        <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
            <header className="relative bg-white">
                <MaxWidthWrapper>
                    <div className="border-b border-gray-200">
                        <div className="h-16 flex items-center">
                            {/* TODO: Mobile navbar */}

                            <div className="ml-4 flex lg:ml-0">
                                <Link href="/">
                                    <Icons.logo className="h-10 h-10" />
                                </Link>
                            </div>

                            <div className="hidden z-50 lg:ml-8 lg:block lg:self-strech">
                                <NavItems />
                            </div>

                            <div className="ml-auto flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-8">
                                    {user? null : (
                                        <Link
                                            href="/sign-in"
                                            className={buttonVariants({variant: "ghost"})}
                                        >
                                            Sign in
                                        </Link>
                                    )}

                                    {user? null:
                                        <span className="h-6 w-px bg-gray-200" aria-hidden="true"/>
                                    }

                                    {user? (<p>{user}</p>): (
                                        <Link
                                            href="/sign-up"
                                            className={buttonVariants({variant: "ghost"})}
                                        >
                                            Create account
                                        </Link>
                                    )}

                                    {user? (
                                        <span
                                            className="h-6 w-px bg-gray-200"
                                            aria-hidden="true"
                                        />
                                    ) : null}

                                    {user? null: (
                                        <div className="flex lg:ml-6">
                                            <span
                                                className="h-6 w-px bg-gray-200"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    )}

                                    <div className="ml-4 flow-root lg:ml-6">
                                        <Cart />
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </MaxWidthWrapper>
            </header>
        </div>
    )
}

export { NavBar }