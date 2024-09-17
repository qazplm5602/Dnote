import style from './button.module.css';

export default function Button({ children, className = [] }: { children?: React.ReactNode, className?: string[] }) {
    className.push(style.default_btn);
    return <button className={className.join(' ')}>{children}</button>;
}