import {MaxWidthWrapper} from "@/components/max-width-wrapper";
import Link from 'next/link'
import {Button, buttonVariants} from "@/components/ui/button";
import {ArrowDownToLine, CheckCircle, Leaf} from "lucide-react";
import {ProductReel} from "@/components/product-reel";

const perks = [
    {
        name: 'Instant delivery',
        icon : ArrowDownToLine,
        description: 'Get your assets delivered to your email in seconds and download them right away.'
    },
    {
        name: 'Guaranteed quality',
        icon : CheckCircle,
        description: 'Every asset on our platform is verified by our team to ensure our highest quality standards. Not happy? we offer 30-days refund guarantee.'
    },
    {
        name: 'For the planet',
        icon : Leaf,
        description: "We've pledged 1% of sales to the preservation and restoration of the natural environment."
    },
]
export default function Home() {
  return (
    <>
        <MaxWidthWrapper>
            <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
              <h1 className="text-4xl text-bold tracking-tight text-gray-900 sm:text-6xl">
                  Your marketplace for high-quality {' '}
                  <span className="text-blue-600">digital assets</span>.
              </h1>
              <p className="mt-6 max-w-prose text-lg text-muted-foreground">
                  Welcome to Hippo UI-kit. Every asset on our platform is verified
                  by our team to ensure highest quality standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link href='/products' className={buttonVariants()}>Browse Trending</Link>
                  <Button variant="ghost">Our quality promise &rarr;</Button>
              </div>
            </div>

            <ProductReel
                title="Brand new"
                subTitle="The most recent products"
                href="/products/recent"
                query={{sort: 'desc', limit: 4}}
            />

        </MaxWidthWrapper>

        <section className="border-t border-gray-200 bg-gray-50">
            <MaxWidthWrapper className="py-20">
                <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
                    {
                        perks.map((perk)=>(
                            <div
                                key={perk.name}
                                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                            >
                                <div className="md:flex-shrink-0 flex justify-center">
                                    <div className="h-16 w-16 rounded-full flex items-center justify-center bg-blue-100 text-blue-900">
                                        {<perk.icon className="h-1/3 w-1/3"/>}
                                    </div>
                                </div>

                                <div className="mt-6 md:ml-4 md:mt-0 gl:ml-0 lg:mt-6">
                                    <h3 className="text-base font-medium text-gray-900">{perk.name}</h3>
                                    <p className="mt-3 text-sm text-muted-foreground">{perk.description}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </MaxWidthWrapper>
        </section>
      </>
  )
}
