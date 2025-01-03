import { SpinnerButton } from '../../Recycle/Button';
import Input from '../../Recycle/Input';
import style from '../settingGeneric.module.css';
import input_style from '../../Recycle/input.module.css';
import { useEffect, useState } from 'react';
import { IsStringBlank } from '../../Utils/misc';
import { useNotify } from '../../Notify/NotifyContext';
import request from '../../Utils/request';
import { useSWRConfig } from 'swr';
import { USER_CACHE_KEY } from '../../LoginState/LoginState';
import { AxiosError } from 'axios';

type Props = {
    title: string
    defaultValue: string,
    payload: string,
    blank?: boolean,
    refresh?: boolean
};
export default function SettingInputField({ title, defaultValue, payload, blank = false, refresh = false }: Props) {
    const [ value, setValue ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const notify = useNotify();
    const { mutate } = useSWRConfig();

    const onInputChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }
    const onApply = async function() {
        if (!blank && IsStringBlank(value)) {
            notify('Error', `${title}란이 비어있습니다.`, 5000);            
            return;
        }

        setLoading(true);
        let data: string | null = value;
        if (IsStringBlank(data)) {
            data = null;
        }

        const result = await request(`profile/${payload}`, { method: "POST", headers: { "Content-Type": "text/plain" }, data }).catch(e => e as AxiosError);
        setLoading(false);
        
        if (result instanceof AxiosError) {
            notify('Error', `변경할 수 없습니다. 나중에 다시 시도하세요.`, 5000);            
            return;
        }

        if (refresh)
            mutate(USER_CACHE_KEY);

        notify("Success", "변경되었습니다.", 5000);
    }

    useEffect(() => {
        setValue(defaultValue || "");
    }, [ defaultValue ]);

    return <section className={style.input_field}>
        <h3>{title}</h3>
        
        <section className={style.in}>
            <Input type='text' className={input_style.input} value={value} onChange={onInputChange} />
            <SpinnerButton className={[style.btn]} onClick={onApply} loading={loading}>변경하기</SpinnerButton>
        </section>
    </section>
}