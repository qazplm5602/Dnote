import style from '../login.module.css';

import AppleIcon from '../../../assets/icons/social/apple.svg';
import DiscordIcon from '../../../assets/icons/social/discord.svg';
import GoogleIcon from '../../../assets/icons/social/google.svg';

export default function LoginSocialBox() {
    return <article className={style.social_login}>
        <SocialButton id='google' icon={GoogleIcon} />
        <SocialButton id='apple' icon={AppleIcon} />
        <SocialButton id='discord' icon={DiscordIcon} />
    </article>;
}

function SocialButton({ id, icon }: { id: string, icon: string }) {
    return <a href={`/oauth2/authorization/${id}`}>
        <button className={style[id]}>
            <img src={icon} />
        </button>
    </a>;
}