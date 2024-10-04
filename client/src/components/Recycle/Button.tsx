import style from './button.module.css';

export default function Button({ children, className = [] }: { children?: React.ReactNode, className?: string[] }) {
    className.push(style.default_btn);
    return <button className={className.join(' ')}>{children}</button>;
}

export function IconButton({ icon, children, className = [] }: { icon: string, children?: React.ReactNode, className?: string[] }) {
    className.push(style.icon_btn);
    
    return <button className={className.join(' ')}>
        <img className={style.ico} src={icon} />
        {children}
    </button>
}