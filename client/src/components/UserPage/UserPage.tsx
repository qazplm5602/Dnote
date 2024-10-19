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
import LoadBox from '../Recycle/LoadBox';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { LoginState } from '../Redux/LoginStateSlice';

interface SocialDTO {
    github: string | null,
    email: string | null
}

export interface ProfileDTO {
    user: UserDTO,
    social: SocialDTO,
    info: string
}

enum LoadStatus {
    Loading,
    Success,
    NotFound,
    Error
}
export default function UserPage() {
    const { id: userId } = useParams();
    const [ profile, setProfile ] = useState<ProfileDTO | null>(null);
    const [ status, setStatus ] = useState<LoadStatus>(LoadStatus.Loading);

    const profileLoad = async function() {
        const { data, status } = await request<ProfileDTO>(`profile/${userId}`).catch(e => e);
        if (status !== 200) return; // 잘못됨...

        setProfile(data);
        setStatus(LoadStatus.Success);
    }

    useEffect(() => {
        setStatus(LoadStatus.Loading);
        profileLoad();
    }, [ userId ]);

    if (status == LoadStatus.Loading) {
        return <main>
            <ProfileLoading />
            <Footer />
        </main>;
    }

    return <main>
        <Profile id={userId} data={profile} />
        <LinkList social={profile?.social} />
        <PopularContent />
        <LatestConent />
        <Footer />
    </main>;
}

function Profile({ id, data }: { id: string | undefined, data: ProfileDTO | null }) {
    return <article className={`${style.profile} screen_container`}>
        <section className={style.left}>
            <img className={style.avater} src={getProfileURL(data?.user.avatar || null)} />
            <div className={style.detail}>
                <div className={style.name}>{data?.user.name || "--"}</div>
                <div className={style.info}>{data?.info}</div>
            </div>
        </section>

        <FollowSection id={id} />
    </article>;
}

function FollowSection({ id }: { id?: string }) {
    const user = useSelector<RootState, LoginState>(v => v.user);
    
    const [ followed, setFollowed ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ count, setCount ] = useState(0);

    const loadStatus = async function(): Promise<boolean> {
        const response = await request<boolean>(`user/follow/status?id=${id}`);
        return response.data;
    }

    const loadCount = async function(): Promise<number> {
        const response = await request<number>(`user/follow/count?id=${id}`);
        return response.data;
    }

    const onStart = async function() {
        // const [ status, num ] = await Promise.all([loadStatus(), loadCount()]);
        // setFollowed(status);
        // setCount(num);

        const num = await loadCount();
        setCount(num);
    }

    useEffect(() => {
        let current = true;

        setLoading(true);
        if (id === undefined) return;

        onStart().then(() => {
            if (current)
                setLoading(false);
        });
        
        return () => { current = false; }
    }, [ id ]);

    useEffect(() => {
        let current = true;
        
        setFollowed(false);
        if (!user.logined || user.id === Number(id)) return;
        
        loadStatus().then(v => {
            if (current)
                setFollowed(v);
        });

        return () => { current = false; }
    }, [ user.logined, user.id, id ]);

    if (loading) return <FollowLoading />;
    
    return <section className={style.right}>
        <IconText icon={HeartIcon} text={count.toString()} className={style.follow} />
        {user.id !== Number(id) && <button className={`${style.follow_btn} ${followed ? style.active : ''}`}>{`${followed ? "언" : ""}팔로우`}</button>}
    </section>;
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

function ProfileLoading() {
    return <article className={`${style.profile} ${style.loading} screen_container`}>
        <section className={style.left}>
            <img className={style.avater} src={getProfileURL(null)} />
            <div className={style.detail}>
                <LoadBox className={style.name} />
                <LoadBox className={style.info} />
            </div>
        </section>

        <FollowLoading />
    </article>;
}

function FollowLoading() {
    return <section className={style.right}>
        <LoadBox className={style.follow_loading} />
    </section>;
}