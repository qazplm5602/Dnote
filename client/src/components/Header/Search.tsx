import style from './header.module.css';
import SearchInput, { useCurrentSearchQuery } from "../Search/Input/Input";
import { useEffect, useRef, useState } from 'react';

type Props = {
    onClick?: () => void,
    onBlur?: () => void,
    lock?: boolean
}

export default function HeaderSearch({ onClick, onBlur, lock = false }: Props) {
    const [ show, setShow ] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const search_query = useCurrentSearchQuery();
    useEffect(() => {
        if (search_query !== '' && !lock)
            setShow(true);
    }, [ search_query ]);

    useEffect(() => {
        if (lock && show) {
            setShow(false);
            if (onClick)
                onClick();
        }
    }, [ lock ]);

    const onInputBlur = function() {
        if (onBlur)
            onBlur();
        
        if (inputRef.current !== null && inputRef.current.value !== "") {
            return; // 숨기지 않음
        }

        setShow(false);
    }
    
    const onSearchBoxClick = function() {
        if (onClick)
            onClick();

        setShow(true);
        
        const input = inputRef.current;
        if (input) {
            input.disabled = false;
            input.focus();
        }
    }

    return <article className={`${style.search} ${show ? '' : style.hide}`}>
        <SearchInput className={style.input} inputRef={inputRef} disabled={!show} onInputBlur={onInputBlur} onBoxClick={onSearchBoxClick} />
    </article>;
}