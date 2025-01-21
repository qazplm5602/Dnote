import { useEffect, useState } from "react";

export function useScreenWidth(maxWidth: number) {
    const [ small, setSmall ] = useState(false);

    const onResize = function() {
        setSmall(window.innerWidth < maxWidth);
    }
    
    useEffect(() => {
        window.addEventListener("resize", onResize);
        onResize();

        return () => window.removeEventListener("resize", onResize);
    }, []);

    return small;
}