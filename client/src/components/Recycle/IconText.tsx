export default function IconText({ icon, text, ...props }: { [key: string]: any, icon: string, text: string }) {
    return <section {...props}>
        <img src={icon} draggable={false} />
        <span>{text}</span>
    </section>
}