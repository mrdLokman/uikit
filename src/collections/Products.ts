import {CollectionConfig} from "payload/types";
import {PRODUCT_CATEGORIES} from "../config";


export const Products: CollectionConfig = {
    slug: 'products',
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