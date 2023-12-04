"use client"

import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {useCart} from "@/hooks/use-cart";
import {Product} from "@/payload-types";


const AddToCartButton = ({product} : {product: Product}) => {
    const {addItem} = useCart();

    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSuccess(false);
        }, 2000);
        return ()=> clearTimeout(timeout);
    }, [isSuccess]);


    return (
        <Button
            onClick={()=> {
                addItem(product);
                setIsSuccess(true);
            }}
            size="lg" className="w-full">
            {isSuccess? "Added!" : "Add to cart"}
        </Button>
    )
}

export {AddToCartButton}