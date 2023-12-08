import {Access, CollectionConfig} from "payload/types";
import {BeforeChangeHook} from "payload/dist/collections/config/types";
import {User} from "../payload-types";
import {boolean} from "zod";


const yourOwnOrPurchased: Access = async ({req})=>{
    const user = req.user as User | null;

    if(!user) return false

    if(user.role === 'admin') return true;

    const {docs: ownProducts} = await req.payload.find({
        collection: 'products',
        depth: 0,
        where: {
            user: {
                equals: user.id,
            },
        },
    })

    const ownProductFilesIds = ownProducts.map((product)=> product.product_files).flat();

    const {docs: ownOrdered} = await req.payload.find({
        collection: 'orders',
        depth: 2,
        where: {
            user: {
                equals: user.id,
            },
        },
    })

    const purchasedProductFilesIds = ownOrdered.map((order)=> {
        return order.products.map((product)=> {
            if(typeof product ==='string') return req.payload.logger.error('Search depth unexpected behaviour');
            return typeof product.product_files === 'string'? product.product_files: product.product_files.id;
        })
    }).filter(Boolean).flat();

    return {
        id: {
            in: [...ownProductFilesIds, ...purchasedProductFilesIds],
        },
    }

}

const setUploader: BeforeChangeHook = ({req, data}) =>{
    const user = req.user as User | null
    return {...data, user: user?.id}
}

export const ProductFiles: CollectionConfig = {
    slug: 'product_files',
    admin: {
        hidden: ({user})=> user.role !== 'admin'
    },
    upload: {
        staticURL: '/product_files',
        staticDir: 'product_files',
        mimeTypes: [
            'image/*',
            'font/*',
            'application/postscript',
        ],
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            required: true,
            admin:{
                condition: ()=>false,
            }
        }
    ],
    hooks: {
        beforeChange: [setUploader],
    },
    access: {
        read: yourOwnOrPurchased,
        update: ({req})=> req.user.role === 'admin',
        delete: ({req})=> req.user.role === 'admin',
    }
}