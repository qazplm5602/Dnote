import style from '../post.module.css';

import { IconButton } from '../../Recycle/Button';
import NameTag from '../../NameTag/NameTag';
import IconText from '../../Recycle/IconText';

import replySvg from '../../../assets/icons/reply.svg';
import goodSvg from '../../../assets/icons/good.svg';
import otherSvg from '../../../assets/icons/other.svg'
import { UserDTO } from '../../LoginState/LoginState';
import { dateFormatNumber, numberWithCommas } from '../../Utils/misc';
import { useEffect, useRef } from 'react';

export interface ChatBaseDTO {
    owner: UserDTO,
    content: string,
    created: string
}

export interface PostChatDTO extends ChatBaseDTO {
    id: number,
    good: number,
    reply_count: number,
    reply?: number
}

type Props = {
    data: PostChatDTO,
    onReplyOpen?: () => void,
    replyOpen?: boolean,
    newChat?: boolean
}

export default function PostChatBox({ data, replyOpen = false, onReplyOpen, newChat = false }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!newChat || ref.current === null) return;
        ref.current.scrollIntoView({ behavior: "smooth", block: 'center' });
    }, [ newChat ]);

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
            {!data.reply && <IconButton icon={replySvg} className={[style.reply]} />}
            <button className={style.good}><IconText icon={goodSvg} text={data.good.toString()} /></button>
            {!replyOpen && !data.reply && <button className={style.reply_open} onClick={onReplyOpen}>답글 {numberWithCommas(data.reply_count)}개</button>}
        </section>
    </div>;
}