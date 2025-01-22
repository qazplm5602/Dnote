import style from '../search.module.css';

import SearchIcon from '../../../assets/icons/ic-search.svg';
import CloseIcon from '../../../assets/icons/ic-close-solid.svg';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IsStringBlank } from '../../Utils/misc';

type Props = {
    className?: string,
    disabled?: boolean,
    inputRef?: React.RefObject<HTMLInputElement>,
    onBoxClick?: React.MouseEventHandler<HTMLDivElement>,
    onInputBlur?: React.FocusEventHandler<HTMLInputElement>,
}
export default function SearchInput({ className = '', disabled, inputRef, onBoxClick, onInputBlur }: Props) {
    const [ value, setValue ] = useState("");
    const search_query = useCurrentSearchQuery();
    const navigate = useNavigate();

    const onInputChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }
    const onInputClear = function() {
        setValue("");
    }
    const onInputKeyDown = function(e: React.KeyboardEvent<HTMLInputElement>) {
        const query = encodeURI(value).replace(new RegExp("#", 'g'), '%23');

        if ((e.code === "Enter" || e.code === "NumpadEnter" || e.key === "Enter") && !IsStringBlank(value)) {
            navigate(`/search?query=${query}&page=1`);
        }
    }

    useEffect(() => {
        if (search_query !== '')
            setValue(search_query);
    }, [search_query]);

    return <div className={`${style.search_box} ${className}`} onClick={onBoxClick}>
    <img className={style.icon} src={SearchIcon} />
    <input type="text" placeholder='검색' value={value} disabled={disabled} ref={inputRef} onBlur={onInputBlur} onChange={onInputChange} onKeyDown={onInputKeyDown} />
    
    {value !== "" && <button className={style.clear} onClick={onInputClear} disabled={disabled}>
        <img src={CloseIcon} />
    </button>}
</div>;
}

export function useCurrentSearchQuery() {
    const [ result, setResult ] = useState("");
    const [ searchParams, _ ] = useSearchParams();
    const search_query = useMemo(() => searchParams.get("query"), [searchParams]);

    useEffect(() => {
        if (location.pathname.startsWith("/search") && search_query) {
            setResult(search_query);
        } else {
            setResult("");
        }
    }, [ location.pathname, search_query ]);

    return result;
}