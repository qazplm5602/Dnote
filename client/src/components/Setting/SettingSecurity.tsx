import style from './settingSecurity.module.css';

export default function SettingSecurity() {
    return <article className={style.main}>
        <SliderToggle id='test222' title='팔로우 공개' desc='다른 사람들도 나의 프로필에서 팔로우 수를 볼 수 있습니다.' />
    </article>;
}

function SliderToggle({ id, title, desc, className }: { id: string, title: string, desc: string, className?: string }) {
    return <div className={`${style.slider_toggle} ${className || ""}`}>
        <section>
            <div className={style.head}>{title}</div>    
            <div className={style.sub}>{desc}</div>    
        </section>

        <section className={style.toggle}>
            <input type="checkbox" id={id} />
            <label htmlFor={id}></label>
        </section>
    </div>
}