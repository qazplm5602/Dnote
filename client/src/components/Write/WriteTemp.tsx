import { CSSTransition } from "react-transition-group";
import style from './write.module.css';

import closeSvg from '../../assets/icons/ic-round-close.svg';
import trashSvg from '../../assets/icons/trash.svg';
import { IconButton } from '../Recycle/Button';
import { useEffect, useRef, useState } from "react";
import LoadBox from "../Recycle/LoadBox";
import request from "../Utils/request";
import { dateFormat } from "../Utils/misc";
import { useSearchParams } from "react-router-dom";
import { useNotify } from "../Notify/NotifyContext";
import { AxiosError } from "axios";

interface PostTempPreview {
    id: string,
    title: string,
    created: string
}

export default function WriteTemp({ show, onClose }: { show: boolean, onClose: () => void }) {
    const nodeRef = useRef(null);
    const [_, setSearchParams] = useSearchParams();
    
    const onBGClick = function() {
        onClose();
    }
    
    const onBoxClick = function(e: React.MouseEvent) {
        e.stopPropagation();
    }
    
    const onTempClick = function(id: string) {
        setSearchParams({temp: id});
        onClose();
    }
    
    return <CSSTransition in={show} nodeRef={nodeRef} unmountOnExit timeout={300} classNames={{
        enter: style.enter,
        enterActive: style.enter_active,
        exit: style.exit,
        exitActive: style.exit_active
    }} >
        <article ref={nodeRef} className={style.temp_main} onClick={onBGClick}>
            <div className={style.box} onClick={onBoxClick}>
                <Head onClose={onClose} />
                <List onTempClick={onTempClick} />
            </div>
        </article>
    </CSSTransition>;
}

function Head({ onClose }: { onClose: () => void }) {
    return <section className={style.head}>
        <h2>임시글 목록</h2>

        <button className={style.close_btn} onClick={onClose}>
            <img src={closeSvg} />
        </button>
    </section>;
}

function List({ onTempClick }: { onTempClick: (id: string) => void }) {
    const notify = useNotify();
    const [ list, setList ] = useState<PostTempPreview[]>([]);
    const [ loading, setLoading ] = useState(true);

    const loadData = async function() {
        const result = await request<PostTempPreview[]>("post/temp/list");

        // 정렬
        result.data.sort((a, b) => {
            const aTime = Number(new Date(a.created));
            const bTime = Number(new Date(b.created));

            if (aTime > bTime)
                return -1;
            else if (aTime < bTime)
                return 1;
            else return 0;
        });

        setList(result.data);
        setLoading(false);
    }

    const onTempRemove = async function(id: string) {
        // 나중에 dialog 추가해서 물어볼꺼임
        // ...
        
        const result = await request(`post/temp/remove?id=${id}`, { method: "DELETE" }).catch(e => e as AxiosError);
        if (result instanceof AxiosError) {
            notify("Error", "임시글 삭제에 실패했습니다.", 5000);
            return;
        }

        // 리스트에서 삭제
        setList(prev => {
            let idx = -1;
            
            prev.forEach((v, i) => {
                if (v.id === id) {
                    idx = i;
                    return false;
                }
            });

            if (idx !== -1)
                prev.splice(idx, 1);

            return [...prev];
        });
    }

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return <section className={style.list}>
            <LoadingBox delay={0} />
            <LoadingBox delay={150} />
            <LoadingBox delay={150 * 2} />
        </section>;
    }

    return <section className={style.list}>
        {list.map(v => <Box key={v.id} data={v} onClick={() => onTempClick(v.id)} onRemove={() => onTempRemove(v.id)} />)}
    </section>;
}

function Box({ data, onClick, onRemove }: { data: PostTempPreview, onClick?: () => void, onRemove?: () => void }) {
    const date = new Date(data.created);
    const removeBtnClick = function(e:React.MouseEvent) {
        e.stopPropagation();

        if (onRemove)
            onRemove();
    }

    return <div className={style.item} onClick={onClick}>
        <div className={style.detail}>
            <div className={style.title}>{data.title}</div>
            <div className={style.sub}>{dateFormat(date)}</div>
        </div>

        <div className={style.interaction}>
            <IconButton icon={trashSvg} onClick={removeBtnClick} />
        </div>
    </div>;
}

function LoadingBox({ delay }: { delay: number }) {
    return <LoadBox className={style.load_item} delay={delay} />
}