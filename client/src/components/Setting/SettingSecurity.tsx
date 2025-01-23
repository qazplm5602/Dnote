import style from './settingSecurity.module.css';
import { SliderToggle } from './SliderToggle/SliderToggle';

export default function SettingSecurity() {
    

    return <article className={style.main}>
        <SliderToggle id='test222' title='팔로우 공개' desc='다른 사람들도 나의 프로필에서 팔로우 수를 볼 수 있습니다.' check={true} />
    </article>;
}