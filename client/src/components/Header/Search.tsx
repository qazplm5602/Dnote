import style from './header.module.css';
import SearchInput, { useCurrentSearchQuery } from "../Search/Input/Input";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function HeaderSearch() {
    const [ show, setShow ] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const search_query = useCurrentSearchQuery();
    useEffect(() => {
        if (search_query !== '')
            setShow(true);
    }, [ search_query ]);

    const onInputBlur = function() {
        if (inputRef.current !== null && inputRef.current.value !== "") {
            return; // 숨기지 않음
        }

        setShow(false);
    }
    
    const onSearchBoxClick = function() {
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