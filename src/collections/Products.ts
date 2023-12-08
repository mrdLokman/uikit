import {CollectionConfig} from "payload/types";
import {PRODUCT_CATEGORIES} from "../config";
import {BeforeChangeHook} from "payload/dist/collections/config/types";
import {Product, User} from "../payload-types";
import {stripe} from "../lib/stripe";

const setUser: BeforeChangeHook<Product> = async ({req, data}) =>{
    const user = req.user as User | null
    return {...data, user: user?.id}
}

const setPrice: BeforeChangeHook<Product> = async (args) =>{
    if(args.operation==='create'){
        const data = args.data as Product;

        const createdStripeProduct = await stripe.products.create({
            name: data.name!,
            default_price_data: {
                currency: 'USD',
                unit_amount: Math.round(data.price*100),
            }
        })

        const updated: Product = {
            ...data,
            stripeId: createdStripeProduct.id,
            priceId: createdStripeProduct.default_price as string,
        };

        return updated;
    }else if(args.operation==='update'){
        const data = args.data as Product;

        const updatedStripeProduct = await stripe.products.update(data.stripeId!, {
            name: data.name!,
            default_price: data.priceId!,
        })

        const updated: Product = {
            ...data,
            stripeId: updatedStripeProduct.id,
            priceId: updatedStripeProduct.default_price as string,
        };

        return updated;
    }
}

export const Products: CollectionConfig = {
    slug: 'products',
    hooks: {
        beforeChange: [
            setUser,
            setPrice,
        ],
    },
    admin: {
        useAsTitle: 'name'
    },
    access: {

    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            hasMany: false,
            admin: {
                condition: ()=> false
            }
        },
        {
            name: 'name',
            label: 'Name',
            type: 'text'
        },
        {
            name: 'description',
            label: 'Product description',
            type: 'textarea'
        },
        {
            name: 'price',
            label: 'Price in USD',
            type: 'number',
            required: true,
            min: 1,
            max: 1000
        },
        {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: PRODUCT_CATEGORIES.map(({label, value})=>({label, value})),
            required: true,
        },
        {
            name: 'product_files',
            label: 'Product file(s)',
            type: 'relationship',
            relationTo: 'product_files',
            required: true,
            hasMany: false
        },
        {
            name: 'approved_for_sale',
            label: 'Product status',
            type: 'select',
            defaultValue: 'pending',
            options: [
                {
                    label: 'Pending verification',
                    value: 'pending'
                },
                {
                    label: 'Approved',
                    value: 'approved'
                },
                {
                    label: 'Rejected',
                    value: 'rejected'
                },
            ],
            required: true,
            access: {
                create: ({req})=> req.user.role === 'admin',
                read: ({req})=> req.user.role === 'admin',
                update: ({req})=> req.user.role === 'admin',
            }
        },
        {
            name: 'priceId',
            type: 'text',
            access: {
                create: ()=>false,
                read: ()=>false,
                update: ()=>false
            },
            admin: {
                hidden: true,
            }
        },
        {
            name: 'stripeId',
            type: 'text',
            access: {
                create: ()=>false,
                read: ()=>false,
                update: ()=>false
            },
            admin: {
                hidden: true,
            }
        },
        {
            name: 'images',
            label: 'Product images',
            type: 'array',
            minRows: 1,
            maxRows: 4,
            required: true,
            labels: {
                singular: 'image',
                plural: 'images'
            },
            fields: [{
                name: 'image',
                type: 'upload',
                relationTo: 'media',
                required: true
            }]
        }
    ]
}