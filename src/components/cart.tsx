"use client"

import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {ShoppingCart} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {formatPrice} from "@/lib/utils";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import {useCart} from "@/hooks/use-cart";
import {CartItem} from "@/components/cart-item";
import {ScrollArea} from "@/components/ui/scroll-area";

const Cart = ()=>{

    const {items} = useCart();

    const total = items.reduce((total, {product})=>total+product.price, 0);

    const fee = 1.5;

    return <Sheet>
        <SheetTrigger className="group -m-2 flex items-center p-2">
            <ShoppingCart aria-hidden="true" className="w-6 h-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"/>
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{items.length??0}</span>
        </SheetTrigger>

        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
            <SheetHeader className="space-y-2.5 pr-6">
                <SheetTitle>Cart ({items.length??0})</SheetTitle>
            </SheetHeader>
            { items.length && items.length > 0?
                (
                    <>
                        <div className="flex flex-col w-full pr-6">
                        <ScrollArea>
                            {items.map(({product}, index)=>(
                                <CartItem product={product} key={product.id} />
                            ))}
                        </ScrollArea>
                        </div>
                        <div className="space-y-4 pr-6">
                            <Separator />

                            <div className="space-y-1.5 text-sm">
                                <div className="flex">
                                    <span className="flex-1">Shipping</span>
                                    <span>Free</span>
                                </div>

                                <div className="flex">
                                    <span className="flex-1">Transaction cost</span>
                                    <span>{formatPrice(fee)}</span>
                                </div>

                                <div className="flex">
                                    <span className="flex-1">Total</span>
                                    <span>{formatPrice(total + fee)}</span>
                                </div>
                            </div>

                            <SheetFooter>
                                <SheetTrigger asChild>
                                    <Link
                                        href="/cart"
                                        className={buttonVariants({
                                            className: "w-full"
                                        })}
                                    >
                                        Continue to checkout
                                    </Link>
                                </SheetTrigger>
                            </SheetFooter>
                        </div>
                    </>
                ):(
                    <div className="flex h-full flex-col justify-center items-center space-y-1">
                        <div aria-hidden="true" className="relative mb-4 w-60 h-60 text-muted-foreground">
                            <Image
                                src="/hippo-empty-cart.png" alt="empty cart"
                                fill
                            />
                        </div>
                        <div className="text-xl font-semibold">Your cart is empty</div>
                        <SheetTrigger asChild>
                            <Link
                                href="/products"
                                className={buttonVariants({
                                    variant: "link",
                                    size: "sm",
                                    className: "text-sm text-muted-foreground"
                                })}
                            >
                                Add items to your cart to checkout
                            </Link>
                        </SheetTrigger>
                    </div>
                )
            }
        </SheetContent>
    </Sheet>
}


export { Cart }