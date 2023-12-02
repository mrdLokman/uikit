import {Access, CollectionConfig} from "payload/types";
import {User} from "../payload-types";
import {BeforeChangeHook} from "payload/dist/collections/config/types";

const isAdminOrHasAccessToImages =
    () : Access =>
        async ({req}) => {
            const user = req.user as User | undefined
            if(!user)
                return false
            if(user.role === 'admin')
                return true
            return {
                user: {
                    equals: req.user.id
                }
            }
        }


const setUploader: BeforeChangeHook = ({req, data}) =>{
    const user = req.user as User | null
    return {...data, user: user?.id}
}

export const Media: CollectionConfig = {
    slug: 'media',
    hooks: {
        beforeChange: [setUploader],
    },
    admin: {
        hidden: ({user})=> user.role !== 'admin'
    },
    upload: {
        staticURL: '/media',
        staticDir: 'media',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre'
            },
            {
                name: 'card',
                width: 768,
                height: 1024,
                position: 'centre'
            },
            {
                name: 'tablet',
                width: 1024,
                height: undefined,
                position: 'centre'
            },
        ],
        mimeTypes: [
            'image/*'
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
    access: {
        read: async ({req})=>{
            const referer = req.headers.referer;
            if(!req.user || !referer?.includes('admin')){
                return true;
            }
            return isAdminOrHasAccessToImages()({req})
        },
        delete: isAdminOrHasAccessToImages(),
        update: isAdminOrHasAccessToImages(),
    },
}