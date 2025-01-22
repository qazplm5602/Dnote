import { useEffect, useRef } from "react";
import SearchInput from "../Search/Input/Input";

type Props = {
    onClose?: () => void,
    active: boolean
}

export default function HeaderShortSearch({ active, onClose }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (active) {
            inputRef.current?.focus();
        }
    }, [ active ]);
    
    if (!active) return null;
    return <SearchInput onInputBlur={onClose} inputRef={inputRef} />;
}