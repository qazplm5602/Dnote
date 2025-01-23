import style from '../settingSecurity.module.css';

type Props = {
    id: string,
    title: string,
    desc: string,
    className?: string,
    check?: boolean,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export function SliderToggle({ id, title, desc, className, check, onChange }: Props) {
    return <div className={`${style.slider_toggle} ${className || ""}`}>
        <section>
            <div className={style.head}>{title}</div>    
            <div className={style.sub}>{desc}</div>    
        </section>

        <section className={style.toggle}>
            <input type="checkbox" id={id} checked={check} onChange={onChange} />
            <label htmlFor={id}></label>
        </section>
    </div>
}