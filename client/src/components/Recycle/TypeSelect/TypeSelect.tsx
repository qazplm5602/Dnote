import style from './typeSelect.module.scss';

type Props = {
    list: string[],
    current: number,
    onSelect?: (id: number) => void
}
export default function TypeSelect({ list, current, onSelect }: Props) {
    const onClick = function(i: number) {
        if (onSelect)
            onSelect(i);
    }

    return <section className={style.main}>
        {list.map((v, i) => <button className={(i === current) ? style.active : ''} onClick={() => onClick(i)} key={v}>{v}</button>)}
    </section>;
}