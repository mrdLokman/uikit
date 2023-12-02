import {Access, CollectionConfig} from "payload/types";

const yourOwnOrders: Access = async ({req: {user}})=>{
    if(user.role==="admin") return true;

    return {
        user: {
            equals: user.id,
        }
    }
}
export const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: 'Your orders',
        description:'Summary of all your orders on DigitalHippo'
    },
    fields: [
        {
            name: '_isPaid',
            type: 'checkbox',
            access: {
                read: ({req})=> req.user.role==='admin',
                create: ()=> false,
                update: ()=> false
            },
            admin: {
                hidden: true,
            },
            required: true,
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            admin: {
                hidden: true,
            },
            required: true,
        },
        {
            name: 'products',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
            required: true,
        }
    ],
    access: {
        read: yourOwnOrders,
        update: ({req})=> req.user.role === 'admin',
        create: ({req})=> req.user.role === 'admin',
        delete: ({req})=> req.user.role === 'admin',
    }
}

