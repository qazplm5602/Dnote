import style from '../post.module.css';

import { IconButton } from '../../Recycle/Button';
import NameTag from '../../NameTag/NameTag';
import IconText from '../../Recycle/IconText';

import replySvg from '../../../assets/icons/reply.svg';
import goodSvg from '../../../assets/icons/good.svg';
import linGoodSvg from '../../../assets/icons/line-good.svg';
import otherSvg from '../../../assets/icons/other.svg'
import { UserDTO } from '../../LoginState/LoginState';
import { dateFormatNumber, numberWithCommas, randomString } from '../../Utils/misc';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { useNavigate } from 'react-router-dom';
import request from '../../Utils/request';

export interface ChatBaseDTO {
    owner: UserDTO,
    content: string,
    created: string
}

export interface PostChatDTO extends ChatBaseDTO {
    id: number,
    good: number,
    my_good: boolean,
    reply_count: number,
    reply?: number
}

type Props = {
    data: PostChatDTO,
    onReplyOpen?: () => void,
    onReplyInput?: () => void
    replyOpen?: boolean,
    newChat?: boolean
}

export default function PostChatBox({ data, replyOpen = false, onReplyOpen, onReplyInput, newChat = false }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const logined = useSelector<RootState, boolean>(v => v.user.logined);
    const [ goodCount, setGoodCount ] = useState(data.good);
    const goodActiveRef = useRef(data.my_good);
    const goodProcessRef = useRef("");
    const navigate = useNavigate();

    const onGoodClick = function() {
        if (!logined) {
            navigate("/login");
            return;
        }

        const id = goodProcessRef.current = randomString(3);
        const changeActive = !goodActiveRef.current;
        request(`chat/${data.id}`, { method: changeActive ? "PUT" : "DELETE" })
        .catch(() => {
            if (id !== goodProcessRef.current) return;

            // 실패함함
            goodActiveRef.current = !changeActive;
            setGoodCount(prev => prev + (!changeActive ? 1 : - 1));
        });

        // 일단 반영
        goodActiveRef.current = changeActive;
        setGoodCount(goodCount + (changeActive ? 1 : - 1));
    }

    useEffect(() => {
        if (!newChat || ref.current === null) return;
        ref.current.scrollIntoView({ behavior: "smooth", block: 'center' });
    }, [ newChat ]);
    
    useEffect(() => {
        setGoodCount(data.good);
        goodProcessRef.current = "";
        goodActiveRef.current = data.my_good;
    }, [data]);

    return <div ref={ref} className={`${style.box} ${data.reply ? style.reply_left : ''}`}>
        <section className={style.detail}>
            <div className={style.info}>
                <NameTag className={style.nametag} user={data.owner} />
                <div className={style.one}></div>
                <div className={style.date}>{dateFormatNumber(new Date(data.created))}</div>
            </div>

            <IconButton icon={otherSvg} className={[style.other]} />
        </section>

        <div className={style.content}>{data.content}</div>

        <section className={style.interaction}>
            {!data.reply && <IconButton icon={replySvg} className={[style.reply]} onClick={onReplyInput} />}
            <button className={style.good} onClick={onGoodClick}><IconText icon={goodActiveRef.current ? goodSvg : linGoodSvg} text={goodCount.toString()} /></button>
            {!replyOpen && !data.reply && <button className={style.reply_open} onClick={onReplyOpen}>답글 {numberWithCommas(data.reply_count)}개</button>}
        </section>
    </div>;
}