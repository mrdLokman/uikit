"use client"
import {useEffect, useRef, useState} from "react";
import {PRODUCT_CATEGORIES} from "@/config";
import {NavItem} from "@/components/nav-item";
import {useOnClickOutside} from "@/hooks/use-on-click-outside";

const NavItems = () => {
    const [activeIndex, setActiveIndex] = useState<null | number>(null);
    const isAnyOpen = activeIndex !== null;

    const navRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(navRef, ()=>setActiveIndex(null));

    useEffect(()=>{
        const handler = (e: KeyboardEvent) => {
            if(e.key === "Escape"){
                setActiveIndex(null);
            }
        }
        document.addEventListener("keydown", handler);
    }, [])

    return (
        <div ref={navRef} className="flex gap-4 h-full">
            {
                PRODUCT_CATEGORIES.map((category, index)=>{
                    const handleOpen = ()=>{
                        if(activeIndex===index){
                            setActiveIndex(null);
                        }else{
                            setActiveIndex(index);
                        }
                    }
                    const isOpen = index === activeIndex;

                    return <NavItem key={category.value}  category={category} handleOpen={handleOpen} isOpen={isOpen} isAnyOpen={isAnyOpen}/>;
                })
            }
        </div>
    )
}

export { NavItems }