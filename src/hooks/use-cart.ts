import {create} from "zustand";
import {Product} from "@/payload-types";
import {createJSONStorage, persist} from "zustand/middleware";

type CartItem = {
    product: Product,
}
type CartState = {
    items: CartItem[],
    addItem: (product: Product) => void,
    removeItem: (id: string) => void,
    clearCart: ()=> void,
}
export const useCart = create<CartState>()(
    persist(
        (set)=>({
            items: [],
            addItem: (product: Product) => set((state)=>{
                return { items: [...state.items, {product}] }
            }),
            removeItem: (id) =>
                set((state)=> ({
                        items: state.items.filter((item)=> item.product.id !== id),
                    })
                ),
            clearCart: ()=> set({items: []}),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(()=> localStorage),
        }
    )
);



