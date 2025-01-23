import { useEffect, useRef, useState } from 'react';
import style from './settingSecurity.module.css';
import { Props, SliderToggle } from './SliderToggle/SliderToggle';
import SettingLoading from './Loading/Loading';
import { aliveType, randomString } from '../Utils/misc';
import request from '../Utils/request';
import { AxiosError } from 'axios';
import { useNotify } from '../Notify/NotifyContext';

interface SettingSecurityDTO {
    followHide: boolean
}

interface SliderProps extends Props {
    onStateChange?: (id: SliderProps['id'], check: boolean) => void,
    id: keyof(SettingSecurityDTO)
}

export default function SettingSecurity() {
    const [ data, setData ] = useState<SettingSecurityDTO | null>(null);

    const onLoad = async function(aliveRef: aliveType) {
        const result = await request<SettingSecurityDTO>("profile/security");
        if (!aliveRef.alive) return;

        setData(result.data);
    }
    
    const onChangeState = function(id: SliderProps["id"], active: boolean) {
        setData(prev => ({ ...prev, [id]: active }));
    }

    useEffect(() => {
        const aliveRef = { alive: true };
        
        onLoad(aliveRef);
        
        return () => {
            aliveRef.alive = false;
        }
    }, []);

    if (data === null) {
        return <article className={style.main}>
            <SettingLoading />
        </article>
    }

    return <article className={style.main}>
        <SecurityToggle id='followHide' title='팔로우 공개' desc='다른 사람들도 나의 프로필에서 팔로우 수를 볼 수 있습니다.' check={!data.followHide} onStateChange={onChangeState} />
    </article>;
}

function SecurityToggle({ onStateChange, ...props }: SliderProps) {
    const idRef = useRef("");
    const notify = useNotify();

    const onToggle = async function(e: React.ChangeEvent<HTMLInputElement>) {
        const willCheck = !e.target.checked;
        
        if (onStateChange)
            onStateChange(props.id, willCheck);

        const id = idRef.current = randomString(3);
        const result = await request("profile/security", { method: "POST", data: { [props.id]: willCheck } }).catch(e => e as AxiosError);
        
        if (idRef.current !== id) return;
        
        if (result instanceof AxiosError) {
            notify('Error', "변경사항을 적용할 수 없습니다. 나중에 다시 시도하세요.", 5000);

            // 다시 돌려 놓음
            if (onStateChange)
                onStateChange(props.id, !willCheck);
        }
    }
    
    return <SliderToggle {...props} onChange={onToggle} />
}