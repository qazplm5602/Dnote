interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
}

export default function Input({ className, type, placeholder, onChange, onFocus, onBlur, ...props }: Props) {
    // 나중에 state 넣을 예정
    
    return <input className={className} type={type} placeholder={placeholder} onChange={onChange} onFocus={onFocus} onBlur={onBlur} {...props} />
}