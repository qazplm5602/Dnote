import { useEffect, useState } from "react";

export function useScreenWidth(maxWidth: number) {
    const [ small, setSmall ] = useState(false);

    const onResize = function(e: UIEvent) {
        setSmall(window.innerWidth < maxWidth);
    }
    
    useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return small;
}