import style from './signupWelcome.module.css';
import btn_style from '../Recycle/button.module.css';

import partyIcon from '../../assets/icons/party-popper.svg';
import { Link } from 'react-router-dom';

export default function SignUpWelcome({ name }: { name: string }) {
    return <article className={style.main}>
        <img src={partyIcon} className={style.party} />
        <h2>Dnote에 오신것을 환영합니다.</h2>

        <pre>
            안녕하세요, <span className={`domi_gradient ${style.name}`}>{name}</span>{`님!

저희 블로그 사이트에 가입해 주셔서 감사합니다! 😊
회원가입이 완료되기 위해서는 이메일 인증이 필요하니, 가입 시 입력하신 이메일로 전송된 인증 메일을 확인해 주세요.
메일에 포함된 링크를 클릭하시면 가입이 최종 완료됩니다.
궁금한 점이 있거나 도움이 필요하시면 언제든지 문의해 주세요.
`}
<span className={style.small}>{`
함께 좋은 시간을 만들어가길 기대합니다! 💌`}</span>
        </pre>

        <Link to={"/login"} className={`${btn_style.default_btn} ${style.goto}`}>로그인으로</Link>
    </article>;
}