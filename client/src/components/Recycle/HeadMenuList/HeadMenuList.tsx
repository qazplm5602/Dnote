import HeadMenu from "../HeadMenu/HeadMenu";
import style from './headmenulist.module.css';

export default function HeadMenuList({ className, headClass, children, title, menu, to }: { className?: string, headClass?: string, children: React.ReactNode, title: string, menu: string, to: string }) {
    const classList = [style.main];
    if (className)
        classList.push(className);
    
    return <article className={classList.join(' ')}>
        <HeadMenu title={title} menu={menu} to={to} className={headClass} />
        <section className={style.list}>{children}</section>
    </article>;
}