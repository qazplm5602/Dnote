import style from './post.module.css';
import goodSvg from '../../assets/icons/good.svg';
import IconText from '../Recycle/IconText';
import { useEffect, useRef, useState } from 'react';
import request from '../Utils/request';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { useNavigate } from 'react-router-dom';
import { randomString } from '../Utils/misc';

type LikeBtnProps = {
    userId: string,
    postId: string
}

export default function PostLikeButton({ userId, postId }: LikeBtnProps) {
    const [ loading, setLoading ] = useState(true);
    const [ count, setCount ] = useState(0);
    const logined = useSelector<RootState, boolean>(v => v.user.logined);
    const selectRef = useRef(false);
    const processRef = useRef("");
    const navigate = useNavigate();

    const loadData = async function(ref: { alive: boolean }) {
        setLoading(true);
        
        const loadList: Promise<any>[] = [loadCountData()];
        if (logined)
            loadList.push(loadSelectData());

        const [ count, check ] = await Promise.all(loadList);
        if (!ref.alive) return;
        
        setLoading(false);
        setCount(count);
        
        if (logined)
            selectRef.current = check;
    }
    
    const loadCountData = async function(): Promise<number> {
        const response = await request<number>(`post/like?user=${userId}&post=${postId}`);
        return response.data;
    }
    const loadSelectData = async function(): Promise<boolean> {
        const response = await request<boolean>(`post/like/check?user=${userId}&post=${postId}`);
        return response.data;
    }

    const requestSetLike = function(value: boolean) {
        selectRef.current = value;
        const id = processRef.current = randomString(5);
        
        setCount(count + (value ? 1 : -1));
        
        request(`post/like?user=${userId}&post=${postId}`, { method: value ? "PUT" : "DELETE" })
        .catch(() => { // 실패함
            if (id === processRef.current) {
                setCount((prev) => prev + (value ? -1 : 1));
                selectRef.current = !value;
            }
        });
    }

    const onClick = function() {
        if (loading) return;
        
        if (!logined) {
            navigate("/login");
            return;
        }

        requestSetLike(!selectRef.current);
    }

    useEffect(() => {
        const aliveRef = { alive: true };

        setLoading(true);
        loadData(aliveRef);

        return () => {
            aliveRef.alive = false;
            processRef.current = ""; // 혹시 모름
        };
    }, [ userId, postId ]);

    return <button className={style.good} onClick={onClick}><IconText icon={goodSvg} text={String(count)} /></button>;
}