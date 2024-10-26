import style from './button.module.css';

export default function Button({ children, className = [], onClick }: { children?: React.ReactNode, className?: string[], onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
    className.push(style.default_btn);
    return <button className={className.join(' ')} onClick={onClick}>{children}</button>;
}

export function IconButton({ icon, children, className = [] }: { icon: string, children?: React.ReactNode, className?: string[] }) {
    className.push(style.icon_btn);
    
    return <button className={className.join(' ')}>
        <img className={style.ico} src={icon} />
        {children}
    </button>
}