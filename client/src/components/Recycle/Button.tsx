import style from './button.module.css';
import Spinner from './Spinner';

export default function Button({ children, className = [], onClick, disabled = false }: { children?: React.ReactNode, className?: string[], onClick?: React.MouseEventHandler<HTMLButtonElement>, disabled?: boolean }) {
    className.push(style.default_btn);
    return <button className={className.join(' ')} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function IconButton({ icon, children, className = [], onClick, domiRef }: { icon: string, children?: React.ReactNode, className?: string[], onClick?: React.MouseEventHandler<HTMLButtonElement>, domiRef?: React.RefObject<HTMLButtonElement> }) {
    className.push(style.icon_btn);
    
    return <button ref={domiRef} className={className.join(' ')} onClick={onClick}>
        <img className={style.ico} src={icon} />
        {children}
    </button>
}

export function SpinnerButton({ children, className = [], spinnerClass, loading, onClick }: { children: React.ReactNode, className?: string[], spinnerClass?: string, loading: boolean, onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
    className.push(style.spinner_btn);
    
    return <Button className={className} disabled={loading} onClick={onClick}>
        {loading && <Spinner className={`${style.spinner} ${spinnerClass || ''}`} />}
        {children}
    </Button>;
}