import { useContext, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { LocaleContext } from "src/app/providers/LocaleContext"

interface LocalizedMarkdownProps {
    id: string
    className?: string
}

export const LocalizedMarkdown = ({ id, className }: LocalizedMarkdownProps) => {
    const { locale } = useContext(LocaleContext)
    const [markdownContent, setMarkdownContent] = useState()

    useEffect(() => {
        import(`src/shared/locales/markdown/${locale}/${id}.md`).then((file) => {
            setMarkdownContent(file.markdown)
        })
    }, [])

    const highlightIfStartsWith = (children: any, markers: string[]) => {
        const childArray = Array.isArray(children) ? children : [children]
        if (childArray.length > 0 && typeof childArray[0] === "string") {
            const text = childArray[0] as string
            const marker = markers.find((m) => text.startsWith(m))
            if (marker) {
                const rest = text.slice(marker.length)
                const tail = childArray.slice(1)
                return (
                    <>
                        <span className="warn">{marker}</span>
                        {rest}
                        {tail}
                    </>
                )
            }
        }
        return children
    }

    const pMarkers = [
        "Не рекомендуется:",
        "Если Вам не предоставлен доступ к облаку",
        "Not recommended:",
        "If you have not been granted access to the cloud:",
        "Nije preporučljivo:",
        "Ako nemate pristup cloudu:",
    ]

    const liMarkers = ["Некорректные фото:", "Incorrect photos:", "Nekorektne fotografije:"]

    return (
        <div className={className}>
            <ReactMarkdown
                components={{
                    p: ({ children }) => <p>{highlightIfStartsWith(children, pMarkers)}</p>,
                    li: ({ children }) => <li>{highlightIfStartsWith(children, liMarkers)}</li>,
                    a: ({ href, children }) => (
                        <a href={href as string} target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                }}
            >
                {markdownContent}
            </ReactMarkdown>
        </div>
    )
}

export default LocalizedMarkdown
