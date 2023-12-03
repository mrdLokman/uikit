"use client"

import Link from "next/link";
import {trpc} from "@/trpc/client";
import {TQueryValidator} from "@/lib/validators";
import {Product} from "@/payload-types";
import {ProductListing} from "@/components/product-listing";

type ProductReelProps = {
    title: string,
    subTitle?: string,
    href?: string,
    query: TQueryValidator,
}

const FALL_BACK_LIMIT = 4;

export const ProductReel = (props: ProductReelProps)=> {
    const {title, subTitle, href, query} = props;

    const { data, isLoading } = trpc.products.getInfiniteProducts.useInfiniteQuery(
        {
            limit: query.limit ?? FALL_BACK_LIMIT,
            query,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextPage
        }
    );

    const products = data?.pages.flatMap((page)=> page.items);

    let map: (Product | null)[] = [];
    if(products && products.length){
        map = products;
    } else {
        if(isLoading){
            map = new Array<null>(query.limit ?? FALL_BACK_LIMIT).fill(null);
        }
    }

    return (
        <section className="py-12">
            <div className="mb-4 md:flex md:items-center md:justify-between">
                <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                    {title? (
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
                    ) : null}

                    {subTitle? (
                        <p className="mt-2 text-sm text-muted-foreground">{subTitle}</p>
                    ) : null}
                </div>

                {href? (
                    <Link
                        href={href}
                        className="hidden text-sm text-blue-600 hover:text-blue-500 md:block"
                    >
                        Shop the collection{' '}<span aria-hidden="true">&rarr;</span>
                    </Link>
                ): null}
            </div>

            <div className="relative">
                <div className="mt-6 w-full flex items-center">
                    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
                        {map.map((item, index) => (
                            <ProductListing key={item?.id} product={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}