import style from '../search.module.css';

import SearchIcon from '../../../assets/icons/ic-search.svg';
import CloseIcon from '../../../assets/icons/ic-close-solid.svg';
import { useState } from 'react';

type Props = {
    className?: string,
    disabled?: boolean,
    inputRef?: React.RefObject<HTMLInputElement>,
    onBoxClick?: React.MouseEventHandler<HTMLDivElement>,
    onInputBlur?: React.FocusEventHandler<HTMLInputElement>,
}
export default function SearchInput({ className = '', disabled, inputRef, onBoxClick, onInputBlur }: Props) {
    const [ value, setValue ] = useState("");
    const onInputChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }
    const onInputClear = function() {
        setValue("");
    }

    return <div className={`${style.search_box} ${className}`} onClick={onBoxClick}>
    <img className={style.icon} src={SearchIcon} />
    <input type="text" placeholder='검색' value={value} disabled={disabled} ref={inputRef} onBlur={onInputBlur} onChange={onInputChange} />
    
    {value !== "" && <button className={style.clear} onClick={onInputClear} disabled={disabled}>
        <img src={CloseIcon} />
    </button>}
</div>;
}