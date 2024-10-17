import Footer from '../Footer/Footer';
import style from './userpage.module.css';

import Avater from '../../assets/image0.jpg';
import IconText from '../Recycle/IconText';
import HeartIcon from '../../assets/icons/heart.svg';
import { Link, useParams } from 'react-router-dom';

import GithubIcon from '../../assets/icons/github.svg';
import EmailIcon from '../../assets/icons/email.svg';
import HeadMenuList from '../Recycle/HeadMenuList/HeadMenuList';
import PostBox from '../PostBox/PostBox';
import { useEffect, useState } from 'react';
import request from '../Utils/request';
import { UserDTO } from '../LoginState/LoginState';
import { getProfileURL } from '../NameTag/NameTag';

interface SocialDTO {
    github: string | null,
    email: string | null
}

export interface ProfileDTO {
    user: UserDTO,
    social: SocialDTO,
    info: string
}

export default function UserPage() {
    const { id: userId } = useParams();
    const [ profile, setProfile ] = useState<ProfileDTO | null>(null);

    const profileLoad = async function() {
        const { data, status } = await request<ProfileDTO>(`profile/${userId}`);
        if (status !== 200) return; // 잘못됨...

        setProfile(data);
    }

    useEffect(() => {
        profileLoad();
    }, [ userId ]);

    return <main>
        <Profile data={profile} />
        <LinkList social={profile?.social} />
        <PopularContent />
        <LatestConent />
        <Footer />
    </main>;
}

function Profile({ data }: { data: ProfileDTO | null }) {
    return <article className={`${style.profile} screen_container`}>
        <section className={style.left}>
            <img className={style.avater} src={getProfileURL(data?.user.avatar || null)} />
            <div className={style.detail}>
                <div className={style.name}>{data?.user.name || "--"}</div>
                <div className={style.info}>{data?.info}</div>
            </div>
        </section>

        <section className={style.right}>
            <IconText icon={HeartIcon} text='10' className={style.follow} />
            <button className={style.follow_btn}>팔로우</button>
        </section>
    </article>;
}

function LinkList({ social }: { social?: SocialDTO }) {
    if (social === undefined || (social.email === null && social.github === null)) return null;

    return <section className={`screen_container ${style.links}`}>
        <span>Link</span>
        <ul>
            {social?.github && <Link to={`https://github.com/${social.github}`}><img src={GithubIcon} /></Link>}
            {social?.email && <Link to={`mailto:${social.email}`}><img src={EmailIcon} /></Link>}
        </ul>
    </section>
}

function PopularContent() {
    return <HeadMenuList title='인기있는 콘텐츠' menu='모두 보기' to='/' className={`${style.list} screen_container`}>
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
    </HeadMenuList>
}

function LatestConent() {
    return <HeadMenuList title='최근 콘텐츠' menu='모두 보기' to='/' className={`${style.list} screen_container`}>
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
    </HeadMenuList>
}